import 'package:flutter/material.dart';
import '../main.dart' as app_colors; // AppColors from main

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  String selectedClass = 'Sunbeam';
  final Map<String, Map<String, bool>> attendanceData = {
    'Sunbeam': {'Emma Johnson': true, 'Noah Wilson': true, 'Liam Smith': false},
    'Rainbow': {'Liam Smith': true, 'Ava Martinez': true, 'Mason Taylor': true},
  };

  @override
  Widget build(BuildContext context) {
    final classStudents = attendanceData[selectedClass] ?? {};

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
              itemCount: classStudents.length,
              itemBuilder: (context, index) {
                final student = classStudents.keys.elementAt(index);
                final isPresent = classStudents[student]!;
                return Dismissible(
                  key: Key(student),
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
                      classStudents[student] = direction == DismissDirection.endToStart;
                    });
                    return true;
                  },
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
                              gradient: LinearGradient(colors: [app_colors.AppColors.primaryBlue, app_colors.AppColors.primaryCoral]),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.person_rounded, color: app_colors.AppColors.white, size: 24),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(student, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                                Text('Age 4 • ID: $index', style: TextStyle(fontSize: 12, color: app_colors.AppColors.textSecondary)),
                              ],
                            ),
                          ),
                          Switch(
                            value: isPresent,
                            onChanged: (value) => setState(() => classStudents[student] = value),
                            activeColor: app_colors.AppColors.mintGlow,
                            thumbColor: app_colors.AppColors.white,
                          ),
                        ],
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
