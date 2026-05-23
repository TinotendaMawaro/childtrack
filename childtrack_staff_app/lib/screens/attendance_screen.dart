import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../main.dart' as app_colors;
import '../main.dart';
import 'student_profile_screen.dart';

class AttendanceScreen extends StatefulWidget {
  final String? initialClassId; // optional pre-selected class from FAB

  const AttendanceScreen({Key? key, this.initialClassId}) : super(key: key);

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  String? selectedClassId;
  List<Map<String, dynamic>> classes = [];
  List<Map<String, dynamic>> children = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    selectedClassId = widget.initialClassId;
    fetchData();
  }

  Future<void> fetchData() async {
    setState(() => loading = true);
    final staffId = Supabase.instance.client.auth.currentUser?.id;
    if (staffId == null) {
      setState(() => loading = false);
      return;
    }

    // Fetch staff's assigned classes
    final staffResponse = await Supabase.instance.client
        .from('staff')
        .select('assigned_class')
        .eq('id', staffId)
        .maybeSingle();

    if (staffResponse != null && staffResponse['assigned_class'] != null) {
      // If no explicit class selected, use assigned class
      selectedClassId ??= staffResponse['assigned_class'];
    }

    // Fetch classes (for dropdown)
    final classesResponse = await Supabase.instance.client
        .from('classes')
        .select('id, name, curriculum')
        .order('name');

    // Fetch children for selected class
    if (selectedClassId != null) {
      final childrenResponse = await Supabase.instance.client
          .from('children')
          .select('''
            id, full_name, dob, photo_url, health_status, allergies,
            profiles!parent_id (full_name, phone, email)
          ''')
          .eq('class_id', selectedClassId)
          .eq('status', 'ACTIVE')
          .order('full_name');

      if (mounted) {
        setState(() {
          classes = List<Map<String, dynamic>>.from(classesResponse ?? []);
          children = List<Map<String, dynamic>>.from(childrenResponse ?? []);
          loading = false;
        });
      }
    } else {
      if (mounted) {
        setState(() {
          classes = List<Map<String, dynamic>>.from(classesResponse ?? []);
          children = [];
          loading = false;
        });
      }
    }
  }

  Future<Map<String, dynamic>?> _getTodayAttendance(String childId) async {
    final today = DateTime.now().toIso8601String().split('T')[0];
    final response = await Supabase.instance.client
        .from('attendance')
        .select('status')
        .eq('child_id', childId)
        .eq('date', today)
        .maybeSingle();
    return response as Map<String, dynamic>?;
  }

  Future<void> _toggleAttendance(String childId, bool present) async {
    final today = DateTime.now().toIso8601String().split('T')[0];
    final status = present ? 'PRESENT' : 'ABSENT';
    final staffId = Supabase.instance.client.auth.currentUser?.id;

    await Supabase.instance.client.from('attendance').upsert({
      'child_id': childId,
      'class_id': selectedClassId,
      'date': today,
      'status': status,
      'recorded_by': staffId,
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Marked as $status'), backgroundColor: app_colors.AppColors.mintGlow),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mark Attendance'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [app_colors.AppColors.primaryBlue, app_colors.AppColors.primaryCoral],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator(color: app_colors.AppColors.primaryBlue))
          : classes.isEmpty
              ? const Center(child: Text('No classes available'))
              : Column(
                  children: [
                    // Class selector
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: DropdownButtonFormField<String>(
                        value: selectedClassId ?? classes.first['id']?.toString(),
                        decoration: InputDecoration(
                          labelText: 'Class',
                          prefixIcon: const Icon(Icons.school_rounded),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: app_colors.AppColors.white.withOpacity(0.5)),
                          ),
                          filled: true,
                          fillColor: app_colors.AppColors.white.withOpacity(0.8),
                        ),
                        items: classes.map((cls) {
                          return DropdownMenuItem(
                            value: cls['id']?.toString(),
                            child: Text('${cls['name']} (${cls['curriculum'] ?? 'Cambridge'})'),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            selectedClassId = value;
                          });
                          fetchData();
                        },
                      ),
                    ),
                    // Students list
                    Expanded(
                      child: children.isEmpty
                          ? const Center(child: Text('No children in this class'))
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: children.length,
                              itemBuilder: (context, index) {
                                final child = children[index];
                                final childId = child['id'] as String?;
                                final fullName = child['full_name'] ?? 'Unknown';
                                final photoUrl = child['photo_url'];
                                final dob = child['dob'];
                                final age = dob != null ? DateTime.now().year - DateTime.parse(dob).year : '?';
                                final parent = child['profiles'] as Map<String, dynamic>?;

                                return FutureBuilder<Map<String, dynamic>?>(
                                  future: _getTodayAttendance(childId!),
                                  builder: (context, snapshot) {
                                    final status = snapshot.data?['status'] as String?;
                                    final isPresent = status == 'PRESENT';
                                    return Dismissible(
                                      key: Key(childId! + index.toString()),
                                      background: Container(
                                        decoration: BoxDecoration(
                                          color: Colors.red.shade400,
                                          borderRadius: BorderRadius.circular(16),
                                        ),
                                        alignment: Alignment.centerLeft,
                                        padding: const EdgeInsets.only(left: 20),
                                        child: const Icon(Icons.close_rounded, color: Colors.white, size: 28),
                                      ),
                                      secondaryBackground: Container(
                                        decoration: BoxDecoration(
                                          color: Colors.green.shade400,
                                          borderRadius: BorderRadius.circular(16),
                                        ),
                                        alignment: Alignment.centerRight,
                                        padding: const EdgeInsets.only(right: 20),
                                        child: const Icon(Icons.check_circle_rounded, color: Colors.white, size: 28),
                                      ),
                                      direction: DismissDirection.horizontal,
                                      confirmDismiss: (direction) async {
                                        final present = direction == DismissDirection.endToStart;
                                        await _toggleAttendance(childId!, present);
                                        return false; // We handle state manually
                                      },
                                      child: InkWell(
                                        onTap: () {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (_) => StudentProfileScreen(childId: childId!),
                                            ),
                                          );
                                        },
                                        borderRadius: BorderRadius.circular(16),
                                        child: Container(
                                          margin: const EdgeInsets.only(bottom: 12),
                                          child: GlassCard(
                                            padding: const EdgeInsets.all(16),
                                            child: Row(
                                              children: [
                                                Container(
                                                  width: 50,
                                                  height: 50,
                                                  decoration: BoxDecoration(
                                                    gradient: const LinearGradient(colors: [app_colors.AppColors.primaryBlue, app_colors.AppColors.primaryCoral]),
                                                    borderRadius: BorderRadius.circular(12),
                                                  ),
                                                  child: photoUrl != null && photoUrl.toString().startsWith('http')
                                                      ? ClipOval(child: Image.network(photoUrl, fit: BoxFit.cover))
                                                      : const Icon(Icons.person_rounded, color: app_colors.AppColors.white, size: 24),
                                                ),
                                                const SizedBox(width: 16),
                                                Expanded(
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      Text(fullName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                                                      Text('Age $age • Tap for profile', style: TextStyle(fontSize: 12, color: app_colors.AppColors.textSecondary)),
                                                    ],
                                                  ),
                                                ),
                                                // Attendance switch
                                                Switch(
                                                  value: isPresent,
                                                  onChanged: (value) => _toggleAttendance(childId!, value),
                                                  activeColor: app_colors.AppColors.mintGlow,
                                                  thumbColor: WidgetStateProperty.all(app_colors.AppColors.white),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                );
                              },
                            ),
                    ),
                  ],
                ),
    );
  }
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  String selectedClass = 'Sunbeam';
  // This will be replaced with real data; using placeholder child IDs
  final Map<String, Map<String, String>> classStudents = {
    // For each student name, map to a childId (would come from database);
    // Placeholders using UUID-like strings for demonstration
    'Sunbeam': {
      'Emma Johnson': '11111111-1111-1111-1111-111111111111',
      'Noah Wilson': '22222222-2222-2222-2222-222222222222',
      'Liam Smith': '33333333-3333-3333-3333-333333333333',
    },
    'Rainbow': {
      'Liam Smith': '33333333-3333-3333-3333-333333333333',
      'Ava Martinez': '44444444-4444-4444-4444-444444444444',
      'Mason Taylor': '55555555-5555-5555-5555-555555555555',
    },
  };

  @override
  Widget build(BuildContext context) {
    final students = classStudents[selectedClass] ?? {};

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mark Attendance'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [app_colors.AppColors.primaryBlue, app_colors.AppColors.primaryCoral],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Class selector
          Padding(
            padding: const EdgeInsets.all(20),
            child: DropdownButtonFormField<String>(
              value: selectedClass,
              decoration: InputDecoration(
                labelText: 'Class',
                prefixIcon: const Icon(Icons.school_rounded),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: app_colors.AppColors.white.withOpacity(0.5)),
                ),
                filled: true,
                fillColor: app_colors.AppColors.white.withOpacity(0.8),
              ),
              items: ['Sunbeam', 'Rainbow', 'Starlight'].map((className) => DropdownMenuItem(
                value: className,
                child: Text(className),
              )).toList(),
              onChanged: (value) => setState(() => selectedClass = value!),
            ),
          ),
          // Students list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: students.length,
              itemBuilder: (context, index) {
                final studentName = students.keys.elementAt(index);
                final childId = students[studentName]!;
                return Dismissible(
                  key: Key(studentName + index.toString()),
                  background: Container(
                    decoration: BoxDecoration(
                      color: Colors.red.shade400,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    alignment: Alignment.centerLeft,
                    padding: const EdgeInsets.only(left: 20),
                    child: const Icon(Icons.close_rounded, color: Colors.white, size: 28),
                  ),
                  secondaryBackground: Container(
                    decoration: BoxDecoration(
                      color: Colors.green.shade400,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: 20),
                    child: const Icon(Icons.check_circle_rounded, color: Colors.white, size: 28),
                  ),
                  direction: DismissDirection.horizontal,
                  confirmDismiss: (direction) async {
                    setState(() {
                      // toggle presence if needed
                    });
                    return true;
                  },
                  child: InkWell(
                    onTap: () {
                      // Navigate to Student Profile Screen
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => StudentProfileScreen(childId: childId),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: GlassCard(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(colors: [app_colors.AppColors.primaryBlue, app_colors.AppColors.primaryCoral]),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.person_rounded, color: app_colors.AppColors.white, size: 24),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(studentName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                                  Text('Age 4 • Tap for profile', style: TextStyle(fontSize: 12, color: app_colors.AppColors.textSecondary)),
                                ],
                              ),
                            ),
                            // Keep the switch for attendance
                            Switch(
                              value: true, // placeholder
                              onChanged: (value) {},
                              activeColor: app_colors.AppColors.mintGlow,
                              thumbColor: WidgetStateProperty.all(app_colors.AppColors.white),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // Submit button
          Padding(
            padding: const EdgeInsets.all(20),
            child: SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Attendance submitted!'), backgroundColor: app_colors.AppColors.mintGlow),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: app_colors.AppColors.mintGlow,
                  foregroundColor: app_colors.AppColors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 8,
                  shadowColor: app_colors.AppColors.mintGlow.withOpacity(0.4),
                ),
                child: const Text('Submit Attendance', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
