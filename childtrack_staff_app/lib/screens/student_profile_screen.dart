import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

// ============ App Colors & GlassCard (duplicate from main.dart) ============

class AppColors {
  static const Color primaryBlue = Color(0xFF4A90E2);
  static const Color primaryCoral = Color(0xFFFF7A59);
  static const Color mintGlow = Color(0xFF6EE7B7);
  static const Color softBackground = Color(0xFFF5F7FB);
  static const Color white = Colors.white;
  static const Color textPrimary = Color(0xFF1E293B);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color accentPink = Color(0xFFFF6B9D);
  static const Color accentYellow = Color(0xFFFFD93D);
  static const Color accentGreen = Color(0xFF6EE7B7);
  static const Color accentPurple = Color(0xFFA78BFA);
}

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final VoidCallback? onTap;
  final bool glow;
  final Color? glowColor;

  const GlassCard({
    Key? key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius = 24,
    this.onTap,
    this.glow = false,
    this.glowColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      decoration: BoxDecoration(
        boxShadow: glow
            ? [
                BoxShadow(
                  color: (glowColor ?? AppColors.mintGlow).withOpacity(0.4),
                  blurRadius: 20,
                  spreadRadius: 0,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.white.withOpacity(0.7),
            borderRadius: BorderRadius.circular(borderRadius),
            border: Border.all(
              color: AppColors.white.withOpacity(0.5),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.08),
                blurRadius: 30,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onTap,
              borderRadius: BorderRadius.circular(borderRadius),
              child: Padding(
                padding: padding ?? const EdgeInsets.all(20),
                child: child,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ============ Student Profile Screen ============

class StudentProfileScreen extends StatefulWidget {
  final String childId;

  const StudentProfileScreen({Key? key, required this.childId}) : super(key: key);

  @override
  _StudentProfileScreenState createState() => _StudentProfileScreenState();
}

class _StudentProfileScreenState extends State<StudentProfileScreen> {
  Map<String, dynamic>? child;
  List<dynamic> attendanceHistory = [];
  List<dynamic> behaviorNotes = [];
  bool loading = true;
  bool loadingNotes = false;
  bool addingNote = false;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    setState(() => loading = true);
    try {
      final client = Supabase.instance.client;

      // Fetch child details with class and parent
      final childResponse = await client
          .from('children')
          .select('''
            *, 
            classes!class_id (name, curriculum),
            profiles!parent_id (full_name, phone, email)
          ''')
          .eq('id', widget.childId)
          .single();

      // Fetch attendance history (last 30 records)
      final attendanceResponse = await client
          .from('attendance')
          .select('id, date, status')
          .eq('child_id', widget.childId)
          .order('date', ascending: false)
          .limit(30);

      // Fetch behavior notes (latest 10)
      final notesResponse = await client
          .from('child_notes')
          .select('''
            id, note, created_at,
            staff:profiles!staff_id (full_name)
          ''')
          .eq('child_id', widget.childId)
          .eq('note_type', 'behavior')
          .order('created_at', ascending: false)
          .limit(10);

      if (mounted) {
        setState(() {
          child = childResponse as Map<String, dynamic>?;
          attendanceHistory = attendanceResponse as List<dynamic>? ?? [];
          behaviorNotes = notesResponse as List<dynamic>? ?? [];
          loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          error = e.toString();
          loading = false;
        });
      }
    }
  }

  Future<void> _addNote() async {
    final controller = TextEditingController();
    final result = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Behavior Note'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(hintText: 'Enter your note'),
          maxLines: 3,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(context, controller.text.trim()),
            child: const Text('Save'),
          ),
        ],
      ),
    );

    if (result == null || result.isEmpty) return;

    setState(() => addingNote = true);
    final staffId = Supabase.instance.client.auth.currentUser?.id;
    if (staffId == null) {
      setState(() => addingNote = false);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Not authenticated')));
      return;
    }

    final errorInsert = await Supabase.instance.client.from('child_notes').insert({
      'child_id': widget.childId,
      'staff_id': staffId,
      'note_type': 'behavior',
      'note': result,
      'is_private': false,
    }).then((_) => null).catchError((e) => e);

    setState(() => addingNote = false);
    if (errorInsert != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $errorInsert')));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Note added')));
      // Refresh notes
      final notesResponse = await Supabase.instance.client
          .from('child_notes')
          .select('id, note, created_at, staff:profiles!staff_id(full_name)')
          .eq('child_id', widget.childId)
          .eq('note_type', 'behavior')
          .order('created_at', ascending: false)
          .limit(10);
      if (mounted) {
        setState(() {
          behaviorNotes = notesResponse as List<dynamic>? ?? [];
        });
      }
    }
  }

  Future<void> _sendMessage() async {
    if (child == null) return;
    final parent = child!['profiles'];
    if (parent == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('No parent contact available')));
      return;
    }
    final parentId = parent['id'];
    final controller = TextEditingController();
    final result = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Send Message to Parent'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(hintText: 'Type your message'),
          maxLines: 3,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(context, controller.text.trim()),
            child: const Text('Send'),
          ),
        ],
      ),
    );
    if (result == null || result.isEmpty) return;

    final staffId = Supabase.instance.client.auth.currentUser?.id;
    if (staffId == null) return;

    // Look for existing conversation
    final conv = await Supabase.instance.client
        .from('conversations')
        .select('id')
        .eq('staff_id', staffId)
        .eq('parent_id', parentId)
        .eq('child_id', widget.childId)
        .maybeSingle();

    String? conversationId;
    if (conv != null) {
      conversationId = conv['id'] as String?;
    } else {
      final newConv = await Supabase.instance.client
          .from('conversations')
          .insert({
            'staff_id': staffId,
            'parent_id': parentId,
            'child_id': widget.childId,
          })
          .select('id')
          .maybeSingle();
      conversationId = newConv?['id'] as String?;
      if (conversationId == null) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to create conversation')));
        return;
      }
    }

    final error = await Supabase.instance.client.from('messages').insert({
      'conversation_id': conversationId,
      'sender_id': staffId,
      'receiver_id': parentId,
      'message': result,
    }).then((_) => null).catchError((e) => e);

    if (error != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $error')));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Message sent!')));
    }
  }

  Future<void> _callParent() async {
    if (child == null) return;
    final parent = child!['profiles'];
    if (parent == null || parent['phone'] == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('No phone number available')));
      return;
    }
    final Uri phoneUri = Uri(scheme: 'tel', path: parent['phone']);
    if (await canLaunchUrl(phoneUri)) {
      await launchUrl(phoneUri);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Cannot make phone call')));
    }
  }

  // Helper: Calculate age from dob
  int calculateAge(String? dob) {
    if (dob == null) return 0;
    final birthDate = DateTime.parse(dob).toUtc();
    final now = DateTime.now();
    int age = now.year - birthDate.year;
    if (now.month < birthDate.month || (now.month == birthDate.month && now.day < birthDate.day)) {
      age--;
    }
    return age;
  }

  Color getHealthColor(String? status) {
    switch ((status ?? '').toLowerCase()) {
      case 'excellent':
      case 'good':
        return AppColors.accentGreen;
      case 'fair':
        return Colors.amber;
      case 'poor':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Color getAttendanceColor(String? status) {
    switch ((status ?? '').toLowerCase()) {
      case 'present':
        return AppColors.accentGreen;
      case 'absent':
        return Colors.red;
      case 'late':
        return Colors.amber;
      case 'excused':
        return AppColors.primaryBlue;
      default:
        return Colors.grey;
    }
  }

  String formatDate(String? dateStr) {
    if (dateStr == null) return 'N/A';
    final date = DateTime.parse(dateStr).toUtc();
    return '${date.month}/${date.day}/${date.year}';
  }

  String formatNoteDate(String? dateStr) {
    if (dateStr == null) return '';
    final date = DateTime.parse(dateStr).toUtc();
    return '${date.month}/${date.day} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Profile', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold)),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryBlue))
          : error != null
              ? Center(child: Text('Error: $error', style: const TextStyle(color: Colors.red)))
              : child == null
                  ? const Center(child: Text('Child not found'))
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Profile Header
                          Center(
                            child: Column(
                              children: [
                                Container(
                                  width: 100,
                                  height: 100,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
                                  ),
                                  padding: const EdgeInsets.all(3),
                                  child: CircleAvatar(
                                    radius: 50,
                                    backgroundColor: Colors.white,
                                    backgroundImage: child!['photo_url'] != null && child!['photo_url'].toString().startsWith('http')
                                        ? NetworkImage(child!['photo_url'])
                                        : null,
                                    child: child!['photo_url'] == null || !child!['photo_url'].toString().startsWith('http')
                                        ? const Text('👶', style: TextStyle(fontSize: 40))
                                        : null,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  child!['full_name'] ?? 'Unknown',
                                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, fontFamily: 'Poppins', color: AppColors.textPrimary),
                                ),
                                Text(
                                  '${calculateAge(child!['dob'])} years • ${child!['classes'] != null ? '${child!['classes']['curriculum'] ?? 'Cambridge'} - ${child!['classes']['name']}' : 'Unassigned'}',
                                  style: const TextStyle(fontSize: 14, color: AppColors.textSecondary),
                                ),
                                if (child!['status'] == 'ACTIVE') ...[
                                  const SizedBox(height: 8),
                                  // Today's attendance check (optional)
                                  FutureBuilder(
                                    future: Supabase.instance.client
                                        .from('attendance')
                                        .select('status')
                                        .eq('child_id', widget.childId)
                                        .eq('date', DateTime.now().toIso8601String().split('T')[0])
                                        .maybeSingle(),
                                    builder: (context, snapshot) {
                                      if (snapshot.hasData && snapshot.data != null) {
                                        final status = snapshot.data!['status'] as String;
                                        return Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: getAttendanceColor(status).withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            'Today: ${status.toUpperCase()}',
                                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: getAttendanceColor(status)),
                                          ),
                                        );
                                      }
                                      return const SizedBox.shrink();
                                    },
                                  ),
                                ],
                              ],
                            ),
                          ),

                          const SizedBox(height: 16),

                          // Action Buttons
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              _ActionButton(icon: Icons.phone, label: 'Call', color: AppColors.primaryBlue, onTap: _callParent),
                              _ActionButton(icon: Icons.message, label: 'Message', color: AppColors.primaryCoral, onTap: _sendMessage),
                              _ActionButton(
                                icon: addingNote ? Icons.hourglass_empty : Icons.add,
                                label: 'Add Note',
                                color: AppColors.accentGreen,
                                onTap: addingNote ? null : _addNote,
                              ),
                            ],
                          ),

                          const SizedBox(height: 20),

                          // Sections
                          _SectionCard(
                            title: 'Attendance History',
                            icon: Icons.calendar_month,
                            color: AppColors.primaryBlue,
                            child: attendanceHistory.isEmpty
                                ? const Center(child: Text('No attendance records'))
                                : Column(
                                    children: attendanceHistory.map((record) {
                                      final date = record['date'] as String?;
                                      final status = record['status'] as String?;
                                      return ListTile(
                                        dense: true,
                                        contentPadding: EdgeInsets.zero,
                                        title: Text(formatDate(date)),
                                        trailing: Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: getAttendanceColor(status).withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            status ?? '',
                                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: getAttendanceColor(status)),
                                          ),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                          ),

                          _SectionCard(
                            title: 'Health Notes',
                            icon: Icons.favorite,
                            color: AppColors.accentPink,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Health Status', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                                    Text(
                                      child!['health_status'] ?? 'Good',
                                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: getHealthColor(child!['health_status'])),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Allergies', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                                    Expanded(
                                      child: (child!['allergies'] as List?)?.isNotEmpty == true
                                          ? Wrap(
                                              spacing: 6,
                                              children: (child!['allergies'] as List).map<Widget>((allergy) {
                                                return Row(
                                                  mainAxisSize: MainAxisSize.min,
                                                  children: [
                                                    const Icon(Icons.warning_amber_rounded, size: 12, color: Colors.red),
                                                    const SizedBox(width: 2),
                                                    Chip(
                                                      label: Text(allergy, style: const TextStyle(fontSize: 11)),
                                                      backgroundColor: Colors.red.withOpacity(0.1),
                                                      padding: EdgeInsets.zero,
                                                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                                    ),
                                                  ],
                                                );
                                              }).toList(),
                                            )
                                          : const Text('None', style: TextStyle(fontSize: 14, color: AppColors.accentGreen)),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),

                          _SectionCard(
                            title: 'Parent Contacts',
                            icon: Icons.people,
                            color: AppColors.primaryBlue,
                            child: child!['profiles'] != null
                                ? Column(
                                    children: [
                                      Row(
                                        children: [
                                          CircleAvatar(
                                            radius: 20,
                                            backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
                                            child: const Icon(Icons.person, size: 20, color: AppColors.primaryBlue),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(child!['profiles']['full_name'] ?? 'Parent', style: const TextStyle(fontWeight: FontWeight.w600)),
                                                const Text('Parent', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 12),
                                      Row(
                                        children: [
                                          Expanded(
                                            child: ElevatedButton.icon(
                                              onPressed: () {
                                                if (child!['profiles']['phone'] != null) {
                                                  launchUrl(Uri(scheme: 'tel', path: child!['profiles']['phone']));
                                                }
                                              },
                                              icon: const Icon(Icons.phone, size: 18),
                                              label: const Text('Call'),
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
                                                foregroundColor: AppColors.primaryBlue,
                                                elevation: 0,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: ElevatedButton.icon(
                                              onPressed: () {
                                                if (child!['profiles']['email'] != null) {
                                                  launchUrl(Uri(scheme: 'mailto', path: child!['profiles']['email']));
                                                }
                                              },
                                              icon: const Icon(Icons.email, size: 18),
                                              label: const Text('Email'),
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: AppColors.primaryCoral.withOpacity(0.1),
                                                foregroundColor: AppColors.primaryCoral,
                                                elevation: 0,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  )
                                : const Center(child: Text('No parent contact assigned')),
                          ),

                          _SectionCard(
                            title: 'Behavior Notes',
                            icon: Icons.note,
                            color: AppColors.accentPurple,
                            child: loadingNotes
                                ? const Center(child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)))
                                : behaviorNotes.isEmpty
                                    ? const Center(child: Text('No behavior notes'))
                                    : Column(
                                        children: behaviorNotes.map<Widget>((note) {
                                          return Container(
                                            margin: const EdgeInsets.only(bottom: 12),
                                            padding: const EdgeInsets.all(12),
                                            decoration: BoxDecoration(
                                              color: Colors.white.withOpacity(0.5),
                                              borderRadius: BorderRadius.circular(12),
                                              border: const Border(left: BorderSide(color: AppColors.accentPurple, width: 3)),
                                            ),
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(note['note'] ?? '', style: const TextStyle(fontSize: 14)),
                                                const SizedBox(height: 6),
                                                Row(
                                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                  children: [
                                                    Text(
                                                      note['staff']?['full_name'] ?? 'Staff',
                                                      style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                                                    ),
                                                    Text(
                                                      formatNoteDate(note['created_at']),
                                                      style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          );
                                        }).toList(),
                                      ),
                          ),

                          _SectionCard(
                            title: 'Progress Summary',
                            icon: Icons.trending_up,
                            color: AppColors.accentGreen,
                            child: Column(
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                                  children: [
                                    Column(
                                      children: [
                                        const Text('Performance', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                                        const SizedBox(height: 4),
                                        Text(
                                          child!['performance'] ?? 'N/A',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                            color: child!['performance'] == 'Excellent'
                                                ? AppColors.accentGreen
                                                : child!['performance'] == 'Good'
                                                    ? AppColors.primaryBlue
                                                    : child!['performance'] == 'Poor'
                                                        ? Colors.red
                                                        : AppColors.textSecondary,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Column(
                                      children: [
                                        const Text('Attendance', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                                        const SizedBox(height: 4),
                                        Text(
                                          '${child!['attendance_average'] ?? 0}%',
                                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                if (child!['awards'] != null && (child!['awards'] as List).isNotEmpty) ...[
                                  const SizedBox(height: 16),
                                  const Align(alignment: Alignment.centerLeft, child: Text('Awards', style: TextStyle(fontSize: 12, color: AppColors.textSecondary))),
                                  const SizedBox(height: 8),
                                  Wrap(
                                    spacing: 8,
                                    children: (child!['awards'] as List).map<Widget>((award) {
                                      return Chip(
                                        label: Text(award, style: const TextStyle(fontSize: 11)),
                                        backgroundColor: AppColors.accentYellow.withOpacity(0.2),
                                        side: BorderSide.none,
                                      );
                                    }).toList(),
                                  ),
                                ],
                              ],
                            ),
                          ),

                          const SizedBox(height: 20),
                        ],
                      ),
                    ),
    );
  }
}

// ============ Helper Widgets ============

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;

  const _ActionButton({required this.icon, required this.label, required this.color, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        height: 80,
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 6),
            Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: color)),
          ],
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final Widget child;

  const _SectionCard({required this.title, required this.icon, required this.color, required this.child});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: color),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, fontFamily: 'Poppins', color: AppColors.textPrimary)),
            ],
          ),
          const Divider(height: 24, thickness: 1),
          child,
        ],
      ),
    );
  }
}
