import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:go_router/go_router.dart';
import '../../main.dart' show AppColors, GlassCard;
import 'staff_home_screen.dart' as staff_providers;

// Providers
final dailyDiaryProvider = FutureProvider.family<Map<String, dynamic>?, String>((ref, classId) async {
  final today = DateTime.now().toIso8601String().split('T')[0];
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return null;

  final response = await Supabase.instance.client
      .from('daily_diaries')
      .select('*')
      .eq('class_id', classId)
      .eq('date', today)
      .maybeSingle();

   return response;
});

final diaryPhotosProvider = FutureProvider.family<List<Map<String, dynamic>>, String>((ref, diaryId) async {
  if (diaryId.isEmpty) return [];

  final response = await Supabase.instance.client
      .from('diary_photos')
      .select('*')
      .eq('diary_id', diaryId)
      .order('created_at');

  return List<Map<String, dynamic>>.from(response ?? []);
});

class DailyDiaryScreen extends ConsumerStatefulWidget {
  const DailyDiaryScreen({super.key});

  @override
  ConsumerState<DailyDiaryScreen> createState() => _DailyDiaryScreenState();
}

class _DailyDiaryScreenState extends ConsumerState<DailyDiaryScreen> {
  final _formKey = GlobalKey<FormState>();
  final _notesController = TextEditingController();

  // Form state
  String _breakfast = '';
  String _lunch = '';
  String _snacks = '';
  TimeOfDay? _napStart;
  TimeOfDay? _napEnd;
  String _mood = 'happy'; // happy, calm, active
  final List<Map<String, dynamic>> _photos = [];
  final List<String> _captions = [];

  String? _currentClassId;
  String? _currentClassName;

  bool _isLoading = false;
  bool _isSaving = false;
  bool _emojiAnimating = false;

  @override
  void initState() {
    super.initState();
    _loadClassData();
  }

  Future<void> _loadClassData() async {
    final classes = await ref.read(staff_providers.assignedClassesProvider.future);
    if (classes.isNotEmpty) {
      setState(() {
        _currentClassId = classes.first['id'] as String;
        _currentClassName = classes.first['name'] as String;
      });
      _loadDiary();
    }
  }

  Future<void> _loadDiary() async {
    if (_currentClassId == null) return;

    setState(() => _isLoading = true);
    try {
      final diary = await ref.read(dailyDiaryProvider(_currentClassId!).future);

      if (diary != null) {
        setState(() {
          _breakfast = diary['breakfast'] ?? '';
          _lunch = diary['lunch'] ?? '';
          _snacks = diary['snacks'] ?? '';
          _notesController.text = diary['notes'] ?? '';
          _mood = diary['mood'] ?? 'happy';

          if (diary['nap_start'] != null) {
            final parts = diary['nap_start'].split(':');
            _napStart = TimeOfDay(
              hour: int.parse(parts[0]),
              minute: int.parse(parts[1]),
            );
          }
          if (diary['nap_end'] != null) {
            final parts = diary['nap_end'].split(':');
            _napEnd = TimeOfDay(
              hour: int.parse(parts[0]),
              minute: int.parse(parts[1]),
            );
          }
        });

        // Load photos if diary has id
        if (diary['id'] != null) {
          final photos = await ref.read(diaryPhotosProvider(diary['id']).future);
          setState(() {
            _photos.clear();
            _photos.addAll(photos.map((p) => {'url': p['photo_url']}));
            _captions.clear();
            for (var photo in photos) {
              _captions.add(photo['caption'] ?? '');
            }
          });
        }
      }
    } catch (e) {
      print('Error loading diary: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

   @override
   void dispose() {
     _notesController.dispose();
     super.dispose();
   }

   Future<void> _saveDiary() async {
    if (_isSaving || _currentClassId == null) return;

    setState(() => _isSaving = true);
    try {
      final session = Supabase.instance.client.auth.currentSession;
      if (session == null) throw Exception('Not authenticated');

      final today = DateTime.now().toIso8601String().split('T')[0];
      final napStartStr = _napStart != null ? '${_napStart!.hour.toString().padLeft(2, '0')}:${_napStart!.minute.toString().padLeft(2, '0')}' : null;
      final napEndStr = _napEnd != null ? '${_napEnd!.hour.toString().padLeft(2, '0')}:${_napEnd!.minute.toString().padLeft(2, '0')}' : null;

      // Upsert diary
      final diaryResponse = await Supabase.instance.client
          .from('daily_diaries')
          .upsert(
            {
              'class_id': _currentClassId!,
              'date': today,
              'breakfast': _breakfast,
              'lunch': _lunch,
              'snacks': _snacks,
              'nap_start': napStartStr,
              'nap_end': napEndStr,
              'mood': _mood,
              'notes': _notesController.text,
              'created_by': session.user.id,
              'updated_at': DateTime.now().toIso8601String(),
            },
            onConflict: 'class_id,date',
          )
          .select()
          .single();

      final diaryId = diaryResponse['id'] as String;

      // Delete old photos and insert new ones
      await Supabase.instance.client
          .from('diary_photos')
          .delete()
          .eq('diary_id', diaryId);

      for (int i = 0; i < _photos.length; i++) {
        await Supabase.instance.client.from('diary_photos').insert({
          'diary_id': diaryId,
          'photo_url': _photos[i]['url'],
          'caption': _captions[i],
        });
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Daily report saved successfully!'),
            backgroundColor: AppColors.mintGlow,
            behavior: SnackBarBehavior.floating,
          ),
        );
         ref.invalidate(dailyDiaryProvider(_currentClassId!));
         ref.invalidate(diaryPhotosProvider(diaryId));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      setState(() => _isSaving = false);
    }
  }

  Future<void> _pickImage(ImageSource source, int photoIndex) async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(
        source: source,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 80,
      );

      if (pickedFile != null) {
        // Upload to Supabase storage
        final fileName = '${_currentClassId!}_${DateTime.now().millisecondsSinceEpoch}_${pickedFile.name}';
        final file = File(pickedFile.path);

        await Supabase.instance.client.storage
            .from('diary-photos')
            .upload(fileName, file);

        final publicUrl = Supabase.instance.client.storage
            .from('diary-photos')
            .getPublicUrl(fileName);

        setState(() {
          if (photoIndex < _photos.length) {
            _photos[photoIndex] = {'url': publicUrl};
            _captions[photoIndex] = '';
          } else {
            _photos.add({'url': publicUrl});
            _captions.add('');
          }
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Upload failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _showPhotoOptions(int photoIndex) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Add Photo',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: _buildPhotoOption(
                    Icons.photo_camera_rounded,
                    'Camera',
                    AppColors.primaryBlue,
                    () => _pickImage(ImageSource.camera, photoIndex),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildPhotoOption(
                    Icons.photo_library_rounded,
                    'Gallery',
                    AppColors.primaryCoral,
                    () => _pickImage(ImageSource.gallery, photoIndex),
                  ),
                ),
              ],
            ),
            if (_photos.isNotEmpty && photoIndex < _photos.length)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _photos.removeAt(photoIndex);
                      _captions.removeAt(photoIndex);
                    });
                    Navigator.pop(context);
                  },
                  icon: const Icon(Icons.delete_rounded),
                  label: const Text('Remove Photo'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.shade100,
                    foregroundColor: Colors.red,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPhotoOption(IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        onTap();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 24),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, size: 48, color: color),
            const SizedBox(height: 12),
            Text(label, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: color)),
          ],
        ),
      ),
    );
  }

  void _selectMood(String mood) {
    setState(() {
      _mood = mood;
      _emojiAnimating = true;
    });
    Future.delayed(const Duration(milliseconds: 300), () {
      setState(() => _emojiAnimating = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBackground,
      appBar: AppBar(
        title: Text(_currentClassName ?? 'Daily Diary', style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
          onPressed: () => context.pop(),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryBlue))
          : Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Meals Section
                    _buildSection(
                      icon: Icons.restaurant_rounded,
                      title: 'Meals',
                      color: AppColors.primaryCoral,
                      child: Column(
                        children: [
                          _buildMealCard(
                            icon: Icons.breakfast_dining_rounded,
                            label: 'Breakfast',
                            value: _breakfast,
                            onChanged: (v) => setState(() => _breakfast = v),
                          ),
                          const SizedBox(height: 12),
                          _buildMealCard(
                            icon: Icons.lunch_dining_rounded,
                            label: 'Lunch',
                            value: _lunch,
                            onChanged: (v) => setState(() => _lunch = v),
                          ),
                          const SizedBox(height: 12),
                          _buildMealCard(
                            icon: Icons.cookie_rounded,
                            label: 'Snacks',
                            value: _snacks,
                            onChanged: (v) => setState(() => _snacks = v),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Nap Time Section
                    _buildSection(
                      icon: Icons.bedtime_rounded,
                      title: 'Nap Time',
                      color: AppColors.accentPurple,
                      child: Row(
                        children: [
                          Expanded(
                            child: _buildTimeCard(
                              icon: Icons.schedule_rounded,
                              label: 'Start',
                              time: _napStart,
                              onTap: () async {
                                final time = await showTimePicker(
                                  context: context,
                                  initialTime: _napStart ?? TimeOfDay.now(),
                                  builder: (context, child) => Theme(
                                    data: ThemeData.light().copyWith(
                                      colorScheme: const ColorScheme.light(
                                        primary: AppColors.primaryBlue,
                                      ),
                                    ),
                                    child: child!,
                                  ),
                                );
                                if (time != null) setState(() => _napStart = time);
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildTimeCard(
                              icon: Icons.schedule_rounded,
                              label: 'End',
                              time: _napEnd,
                              onTap: () async {
                                final time = await showTimePicker(
                                  context: context,
                                  initialTime: _napEnd ?? TimeOfDay.now(),
                                  builder: (context, child) => Theme(
                                    data: ThemeData.light().copyWith(
                                      colorScheme: const ColorScheme.light(
                                        primary: AppColors.primaryBlue,
                                      ),
                                    ),
                                    child: child!,
                                  ),
                                );
                                if (time != null) setState(() => _napEnd = time);
                              },
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Activities Section
                    _buildSection(
                      icon: Icons.photo_library_rounded,
                      title: 'Activities',
                      color: AppColors.primaryBlue,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Photos from today',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
                          ),
                          const SizedBox(height: 12),
                          ...List.generate(5, (index) {
                            final hasPhoto = index < _photos.length;
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: GestureDetector(
                                      onTap: () => _showPhotoOptions(index),
                                      child: AnimatedContainer(
                                        duration: const Duration(milliseconds: 300),
                                        height: 80,
                                        decoration: BoxDecoration(
                                          color: hasPhoto
                                              ? AppColors.mintGlow.withOpacity(0.2)
                                              : Colors.grey.shade200,
                                          borderRadius: BorderRadius.circular(16),
                                          border: Border.all(
                                            color: hasPhoto
                                                ? AppColors.mintGlow
                                                : Colors.grey.shade300,
                                            width: 2,
                                          ),
                                        ),
                                        child: hasPhoto
                                            ? Stack(
                                                children: [
                                                  ClipRRect(
                                                    borderRadius: BorderRadius.circular(14),
                                                    child: Image.network(
                                                      _photos[index]['url'],
                                                      fit: BoxFit.cover,
                                                      width: double.infinity,
                                                      height: double.infinity,
                                                      errorBuilder: (_, __, ___) => const Icon(
                                                        Icons.broken_image_rounded,
                                                        color: Colors.grey,
                                                      ),
                                                    ),
                                                  ),
                                                  Positioned(
                                                    top: 4,
                                                    right: 4,
                                                    child: Container(
                                                      padding: const EdgeInsets.all(4),
                                                      decoration: const BoxDecoration(
                                                        color: AppColors.white,
                                                        shape: BoxShape.circle,
                                                      ),
                                                      child: const Icon(
                                                        Icons.edit_rounded,
                                                        size: 16,
                                                        color: AppColors.primaryBlue,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              )
                                            : Column(
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                children: [
                                                  Icon(
                                                    Icons.add_photo_alternate_rounded,
                                                    size: 32,
                                                    color: AppColors.primaryBlue,
                                                  ),
                                                  const SizedBox(height: 4),
                                                  Text(
                                                    'Add Photo ${index + 1}',
                                                    style: const TextStyle(
                                                      fontSize: 12,
                                                      color: AppColors.textSecondary,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                      ),
                                    ),
                                  ),
                                  if (hasPhoto)
                                    Padding(
                                      padding: const EdgeInsets.only(left: 8),
                                      child: IconButton(
                                        onPressed: () {
                                          setState(() {
                                            _photos.removeAt(index);
                                            _captions.removeAt(index);
                                          });
                                        },
                                        icon: const Icon(Icons.close_rounded, color: Colors.red),
                                      ),
                                    ),
                                ],
                              ),
                            );
                          }),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Mood Section
                    _buildSection(
                      icon: Icons.emoji_emotions_rounded,
                      title: 'Mood',
                      color: AppColors.accentYellow,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildMoodOption(
                            emoji: '😊',
                            label: 'Happy',
                            selected: _mood == 'happy',
                          ),
                          _buildMoodOption(
                            emoji: '😌',
                            label: 'Calm',
                            selected: _mood == 'calm',
                          ),
                          _buildMoodOption(
                            emoji: '⚡',
                            label: 'Active',
                            selected: _mood == 'active',
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Notes Section
                    _buildSection(
                      icon: Icons.note_rounded,
                      title: 'Teacher Notes',
                      color: AppColors.accentGreen,
                      child: TextFormField(
                        controller: _notesController,
                        maxLines: 4,
                        maxLength: 500,
                        decoration: InputDecoration(
                          hintText: 'Add observations about the day...',
                          hintStyle: TextStyle(color: Colors.grey.shade400),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide.none,
                          ),
                          filled: true,
                          fillColor: AppColors.white.withOpacity(0.5),
                          contentPadding: const EdgeInsets.all(16),
                        ),
                        style: const TextStyle(fontSize: 16, color: AppColors.textPrimary),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      height: 60,
                      child: ElevatedButton(
                        onPressed: _isSaving || _currentClassId == null ? null : _saveDiary,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.mintGlow,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          elevation: 8,
                          shadowColor: AppColors.mintGlow.withOpacity(0.6),
                        ),
                        child: _isSaving
                            ? const SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.save_rounded, size: 28),
                                  const SizedBox(width: 12),
                                  const Text(
                                    'Save Daily Report',
                                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                      ),
                    ),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSection({
    required IconData icon,
    required String title,
    required Color color,
    required Widget child,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: color.withOpacity(0.1)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: [color, color.withOpacity(0.7)]),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.3),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(icon, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 16),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            child,
          ],
        ),
      ),
    );
  }

  Widget _buildMealCard({
    required IconData icon,
    required String label,
    required String value,
    required ValueChanged<String> onChanged,
  }) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primaryCoral, size: 28),
          const SizedBox(width: 16),
          Expanded(
            child: TextField(
              decoration: InputDecoration(
                labelText: label,
                labelStyle: const TextStyle(color: AppColors.textSecondary),
                border: InputBorder.none,
              ),
              style: const TextStyle(fontSize: 16, color: AppColors.textPrimary),
              onChanged: onChanged,
            ),
          ),
          if (value.isNotEmpty)
            const Icon(Icons.check_circle_rounded, color: AppColors.mintGlow, size: 20),
        ],
      ),
    );
  }

  Widget _buildTimeCard({
    required IconData icon,
    required String label,
    required TimeOfDay? time,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: AppColors.accentPurple, size: 20),
                const SizedBox(width: 8),
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              time != null ? time.format(context) : 'Select time',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: time != null ? AppColors.textPrimary : Colors.grey.shade400,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMoodOption({
    required String emoji,
    required String label,
    required bool selected,
  }) {
    return GestureDetector(
      onTap: () => _selectMood(selected ? _mood : label.toLowerCase()),
      child: AnimatedScale(
        duration: const Duration(milliseconds: 200),
        scale: selected && _emojiAnimating ? 1.2 : (selected ? 1.1 : 1.0),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: selected
                ? _getMoodColor(label.toLowerCase()).withOpacity(0.15)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: selected
                  ? _getMoodColor(label.toLowerCase())
                  : Colors.grey.shade300,
              width: selected ? 2 : 1,
            ),
            boxShadow: selected
                ? [
                    BoxShadow(
                      color: _getMoodColor(label.toLowerCase()).withOpacity(0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          child: Column(
            children: [
              Text(
                emoji,
                style: const TextStyle(fontSize: 48),
              ),
              const SizedBox(height: 8),
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: selected ? _getMoodColor(label.toLowerCase()) : AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getMoodColor(String mood) {
    switch (mood) {
      case 'happy':
        return AppColors.mintGlow;
      case 'calm':
        return AppColors.primaryBlue;
      case 'active':
        return AppColors.accentYellow;
      default:
        return AppColors.textSecondary;
    }
  }
}
