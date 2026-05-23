import 'dart:io';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:image_picker/image_picker.dart';
import '../main.dart' as app_colors;
import '../main.dart';

class DailyDiaryScreen extends StatefulWidget {
  final String? classId; // optional pre-selected class

  const DailyDiaryScreen({Key? key, this.classId}) : super(key: key);

  @override
  State<DailyDiaryScreen> createState() => _DailyDiaryScreenState();
}

class _DailyDiaryScreenState extends State<DailyDiaryScreen> {
  String? selectedClassId;
  List<Map<String, dynamic>> classes = [];
  List<Map<String, dynamic>> children = [];
  bool loading = true;
  bool saving = false;

  final _mealsController = TextEditingController();
  final _napsController = TextEditingController();
  final _activitiesController = TextEditingController();
  final _notesController = TextEditingController();
  
  String? _selectedMood;
  final List<XFile> _photos = [];

  final List<String> moodOptions = ['happy', 'calm', 'active', 'tired', 'sad'];

  @override
  void initState() {
    super.initState();
    selectedClassId = widget.classId;
    fetchData();
  }

  Future<void> fetchData() async {
    setState(() => loading = true);
    final staffId = Supabase.instance.client.auth.currentUser?.id;
    if (staffId == null) {
      setState(() => loading = false);
      return;
    }

    // Get staff's assigned class
    final staffResponse = await Supabase.instance.client
        .from('staff')
        .select('assigned_class')
        .eq('id', staffId)
        .maybeSingle();

    selectedClassId ??= staffResponse?['assigned_class'] as String?;

    // Fetch classes for dropdown
    final classesResponse = await Supabase.instance.client
        .from('classes')
        .select('id, name, curriculum')
        .order('name');

    if (mounted) {
      setState(() {
        classes = List<Map<String, dynamic>>.from(classesResponse ?? []);
        loading = false;
      });
    }
  }

  Future<void> _pickPhotos() async {
    final picker = ImagePicker();
    final picked = await picker.pickMultiImage();
    if (picked != null) {
      setState(() {
        _photos.addAll(picked);
      });
    }
  }

  Future<void> _saveDiary() async {
    if (selectedClassId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a class'), backgroundColor: Colors.red),
      );
      return;
    }

    setState(() => saving = true);

    // Upload photos if any
    List<String> photoUrls = [];
    for (final photo in _photos) {
      final fileName = 'diary/${DateTime.now().millisecondsSinceEpoch}-${photo.name}';
      final error = await Supabase.instance.client.storage
          .from('diary-photos')
          .upload(fileName, await photo.readAsBytes());
      if (error == null) {
        final { data: { publicUrl } } = Supabase.instance.client.storage
            .from('diary-photos')
            .getPublicUrl(fileName);
        photoUrls.add(publicUrl);
      }
    }

    final today = DateTime.now().toIso8601String().split('T')[0];
    final staffId = Supabase.instance.client.auth.currentUser?.id;

    final diaryData = {
      'class_id': selectedClassId,
      'date': today,
      'meals': _mealsController.text.trim(),
      'naps': _napsController.text.trim(),
      'activities': _activitiesController.text.trim(),
      'mood': _selectedMood,
      'photos': photoUrls,
      'notes': _notesController.text.trim(),
      'created_by': staffId,
    };

    // Upsert entry for this class and date
    final existing = await Supabase.instance.client
        .from('daily_diary')
        .select('id')
        .eq('class_id', selectedClassId)
        .eq('date', today)
        .maybeSingle();

    if (existing != null) {
      await Supabase.instance.client
          .from('daily_diary')
          .update(diaryData)
          .eq('id', existing['id']);
    } else {
      await Supabase.instance.client
          .from('daily_diary')
          .insert(diaryData);
    }

    setState(() => saving = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Diary entry saved successfully!'), backgroundColor: app_colors.AppColors.mintGlow),
      );
      // Clear form
      _mealsController.clear();
      _napsController.clear();
      _activitiesController.clear();
      _notesController.clear();
      setState(() {
        _selectedMood = null;
        _photos.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Daily Diary', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold)),
        centerTitle: true,
        actions: [
          if (saving)
            const Center(child: Padding(padding: EdgeInsets.all(16), child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)))),
          TextButton(
            onPressed: saving ? null : _saveDiary,
            child: const Text('Save', style: TextStyle(fontWeight: FontWeight.w600)),
          ),
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Class selector
                  GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: DropdownButtonFormField<String>(
                      value: selectedClassId ?? (classes.isNotEmpty ? classes.first['id']?.toString() : null),
                      decoration: InputDecoration(
                        labelText: 'Class',
                        prefixIcon: const Icon(Icons.school_rounded),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        filled: true,
                        fillColor: app_colors.AppColors.white.withOpacity(0.5),
                      ),
                      items: classes.map((cls) {
                        return DropdownMenuItem(
                          value: cls['id']?.toString(),
                          child: Text('${cls['name']} (${cls['curriculum'] ?? 'Cambridge'})'),
                        );
                      }).toList(),
                      onChanged: (value) => setState(() => selectedClassId = value),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Mood selector
                  GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Class Mood', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          children: moodOptions.map((mood) {
                            final isSelected = _selectedMood == mood;
                            return ChoiceChip(
                              label: Text(mood),
                              selected: isSelected,
                              onSelected: (selected) {
                                setState(() {
                                  _selectedMood = selected ? mood : null;
                                });
                              },
                              selectedColor: app_colors.AppColors.mintGlow.withOpacity(0.3),
                              backgroundColor: app_colors.AppColors.white.withOpacity(0.5),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Meals
                  GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Meals', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _mealsController,
                          decoration: const InputDecoration(
                            hintText: 'Breakfast, lunch, snacks details',
                            border: OutlineInputBorder(),
                          ),
                          maxLines: 2,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Naps
                  GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Nap Times', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _napsController,
                          decoration: const InputDecoration(
                            hintText: 'e.g., 1:00 PM - 2:30 PM',
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Activities
                  GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Activities', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _activitiesController,
                          decoration: const InputDecoration(
                            hintText: 'Describe today\'s activities',
                            border: OutlineInputBorder(),
                          ),
                          maxLines: 3,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Photos
                  GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Photos', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                            TextButton.icon(
                              onPressed: _pickPhotos,
                              icon: const Icon(Icons.camera_alt),
                              label: const Text('Add'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        if (_photos.isNotEmpty)
                          SizedBox(
                            height: 80,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _photos.length,
                              itemBuilder: (context, index) {
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8.0),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: Image.file(
                                      // ignore: avoid_single_cascade_in_method_call
                                      File(_photos[index].path),
                                      width: 80,
                                      height: 80,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                );
                              },
                            ),
                          )
                        else
                          Container(
                            height: 80,
                            decoration: BoxDecoration(
                              color: app_colors.AppColors.white.withOpacity(0.5),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: app_colors.AppColors.white.withOpacity(0.5)),
                            ),
                            child: const Center(
                              child: Text('No photos added', style: TextStyle(color: app_colors.AppColors.textSecondary)),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Notes
                  GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Additional Notes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _notesController,
                          decoration: const InputDecoration(
                            hintText: 'Any special remarks',
                            border: OutlineInputBorder(),
                          ),
                          maxLines: 3,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 80), // bottom padding
                ],
              ),
            ),
    );
  }
}
