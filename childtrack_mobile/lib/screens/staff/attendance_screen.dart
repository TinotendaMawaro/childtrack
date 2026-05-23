import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../main.dart' show AppColors, GlassCard;
import 'staff_home_screen.dart' as staff_providers;

class AttendanceScreen extends ConsumerStatefulWidget {
  const AttendanceScreen({super.key});

  @override
  ConsumerState<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends ConsumerState<AttendanceScreen> {
  final Map<String, SwipeState> _swipeStates = {};

  @override
  Widget build(BuildContext context) {
    final assignedClassesAsync = ref.watch(staff_providers.assignedClassesProvider);
    
    return assignedClassesAsync.when(
      data: (classes) {
        if (classes.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.school_outlined, size: 80, color: Colors.grey),
                SizedBox(height: 16),
                Text('No classes assigned', style: TextStyle(fontSize: 18)),
              ],
            ),
          );
        }

        final classId = classes.first['id'] as String;
        final className = classes.first['name'] as String;

        return Column(
          children: [
            _buildClassHeader(className),
            Expanded(child: _buildStudentList(classId)),
            _buildSubmitButton(classId),
          ],
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, _) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.red),
            const SizedBox(height: 8),
            Text('Error: $err'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => ref.invalidate(staff_providers.assignedClassesProvider),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildClassHeader(String className) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.white.withOpacity(0.9),
        border: Border(bottom: BorderSide(color: Colors.grey.shade200, width: 1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.school_rounded, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Class', style: TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w500)),
                Text(className, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.mintGlow.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text('Staff', style: TextStyle(fontSize: 12, color: AppColors.mintGlow, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }

   Widget _buildStudentList(String classId) {
     final childrenAsync = ref.watch(staff_providers.childrenInClassProvider(classId));
     final attendanceAsync = ref.watch(staff_providers.todayAttendanceProvider(classId));

    return childrenAsync.when(
      data: (children) {
        final attendance = attendanceAsync.value ?? {};
        final presentCount = attendance.values.where((s) => s == 'PRESENT').length;

        if (children.isEmpty) {
          return const Center(child: Text('No children in this class'));
        }

        return Column(
          children: [
            // Stats bar
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [BoxShadow(color: AppColors.primaryBlue.withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 6))],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatItem('Total', children.length.toString(), Colors.white),
                  Container(width: 1, height: 40, color: Colors.white.withOpacity(0.3)),
                  _buildStatItem('Present', presentCount.toString(), AppColors.mintGlow),
                  Container(width: 1, height: 40, color: Colors.white.withOpacity(0.3)),
                  _buildStatItem('Absent', (children.length - presentCount).toString(), Colors.red.shade300),
                ],
              ),
            ),

            // Student list with swipe
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: children.length,
                itemBuilder: (context, index) {
                  final child = children[index];
                  final childId = child['id'] as String;
                  final status = attendance[childId] ?? 'ABSENT';
                  final isPresent = status == 'PRESENT';
                  final swipeState = _swipeStates[childId];

                  return GestureDetector(
                    onHorizontalDragStart: (details) => _handleTouchStart(childId, details),
                    onHorizontalDragUpdate: (details) => _handleTouchUpdate(childId, details),
                    onHorizontalDragEnd: (details) => _handleTouchEnd(childId, classId),
                    child: _buildSwipeableCard(
                      child: _buildChildCard(child, isPresent, classId),
                      swipeX: swipeState?.currentX ?? 0,
                      isSwiping: swipeState?.swiping ?? false,
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, _) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline_rounded, size: 48, color: Colors.red),
            const SizedBox(height: 8),
            Text('Error: $err'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => ref.invalidate(staff_providers.childrenInClassProvider(classId)),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: Colors.white)),
        Text(label, style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.85), fontWeight: FontWeight.w500)),
      ],
    );
  }

  Widget _buildSwipeableCard({
    required Widget child,
    required double swipeX,
    required bool isSwiping,
  }) {
    final translateX = swipeX.clamp(-150.0, 150.0);
    final showPresent = swipeX > 50;
    final showAbsent = swipeX < -50;

    return Stack(
      children: [
        if (showPresent)
          Positioned.fill(
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: AppColors.mintGlow,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Center(child: Icon(Icons.check_circle_rounded, color: Colors.white, size: 48)),
            ),
          ),
        if (showAbsent)
          Positioned.fill(
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.red.shade400,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Center(child: Icon(Icons.cancel_rounded, color: Colors.white, size: 48)),
            ),
          ),
        Transform.translate(
          offset: Offset(translateX, 0),
          child: Opacity(opacity: isSwiping ? 0.95 : 1.0, child: child),
        ),
      ],
    );
  }

  Widget _buildChildCard(Map<String, dynamic> child, bool isPresent, String classId) {
    final fullName = child['full_name'] ?? 'Unknown';
    final dob = child['dob'];
    final photoUrl = child['photo_url'];
    
    String ageText = 'Age N/A';
    if (dob != null) {
      try {
        final birthDate = DateTime.parse(dob).toLocal();
        final today = DateTime.now();
        int age = today.year - birthDate.year;
        if (today.month < birthDate.month || (today.month == birthDate.month && today.day < birthDate.day)) {
          age--;
        }
        ageText = 'Age $age';
      } catch (e) {
        ageText = 'Age N/A';
      }
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        glow: isPresent,
        glowColor: AppColors.mintGlow.withOpacity(0.3),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: photoUrl != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.network(photoUrl, fit: BoxFit.cover, errorBuilder: (_, __, ___) => _buildInitialsAvatar(fullName)),
                      )
                    : _buildInitialsAvatar(fullName),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(fullName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                    Text(ageText, style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              _buildToggleSwitch(isPresent, () async {
                final newStatus = isPresent ? 'ABSENT' : 'PRESENT';
                await _markAttendance(classId, child['id'] as String, newStatus);
              }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInitialsAvatar(String name) {
    final parts = name.trim().split(' ');
    String initials = '';
    if (parts.length >= 2) {
      initials = '${parts[0][0]}${parts[1][0]}';
    } else if (parts.isNotEmpty && parts[0].isNotEmpty) {
      initials = parts[0].substring(0, parts[0].length > 1 ? 2 : 1);
    }
    
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Center(
        child: Text(
          initials.toUpperCase(),
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildToggleSwitch(bool isPresent, VoidCallback onToggle) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 56,
          height: 32,
          decoration: BoxDecoration(
            color: isPresent ? AppColors.mintGlow : Colors.grey.shade300,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Stack(
            children: [
              AnimatedPositioned(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeInOut,
                left: isPresent ? 24 : 4,
                top: 4,
                child: Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 4, offset: const Offset(0, 2))],
                  ),
                ),
              ),
              Positioned.fill(
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: onToggle,
                    child: const SizedBox(width: 56, height: 32),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 4),
        Text(
          isPresent ? 'Present' : 'Absent',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: isPresent ? AppColors.mintGlow : Colors.grey.shade600),
        ),
      ],
    );
  }

   Widget _buildSubmitButton(String classId) {
     final attendanceAsync = ref.watch(staff_providers.todayAttendanceProvider(classId));
     final childrenAsync = ref.watch(staff_providers.childrenInClassProvider(classId));

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.white.withOpacity(0.95),
        border: Border(top: BorderSide(color: Colors.grey.shade200, width: 1)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))],
      ),
      child: attendanceAsync.when(
        data: (attendance) {
          final presentCount = attendance.values.where((s) => s == 'PRESENT').length;
          return childrenAsync.when(
            data: (children) {
              final total = children.length;
              final allMarked = attendance.length >= total;
              
              return SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: allMarked ? _submitAttendance : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.mintGlow,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 8,
                    shadowColor: AppColors.mintGlow.withOpacity(0.6),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.check_circle_rounded, size: 24),
                      const SizedBox(width: 12),
                      Text('Submit ($presentCount/$total)', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              );
            },
            loading: () => const SizedBox(width: double.infinity, height: 56, child: ElevatedButton(onPressed: null, child: Text('Submit'))),
            error: (_, __) => const SizedBox(),
          );
        },
        loading: () => const SizedBox(width: double.infinity, height: 56, child: ElevatedButton(onPressed: null, child: Text('Submit'))),
        error: (_, __) => const SizedBox(),
      ),
    );
  }

  // Swipe handlers
   void _handleTouchStart(String childId, DragStartDetails details) {
     setState(() {
       _swipeStates[childId] = SwipeState(
         startX: details.globalPosition.dx,
         startY: details.globalPosition.dy,
         currentX: 0,
         swiping: false,
       );
     });
   }

  void _handleTouchUpdate(String childId, DragUpdateDetails details) {
    final state = _swipeStates[childId];
    if (state == null) return;

    final deltaX = details.globalPosition.dx - state.startX;
    final deltaY = (details.globalPosition.dy - state.startY).abs();

    if (!state.swiping && deltaX.abs() > 10 && deltaX > deltaY) {
      setState(() => _swipeStates[childId] = state.copyWith(swiping: true, currentX: deltaX));
    } else if (state.swiping) {
      setState(() => _swipeStates[childId] = state.copyWith(currentX: deltaX));
    }
  }

  Future<void> _handleTouchEnd(String childId, String classId) async {
    final state = _swipeStates[childId];
    if (state == null || !state.swiping) return;

    final threshold = 100.0;
    final currentX = state.currentX;

    if (currentX > threshold) {
      await _markAttendance(classId, childId, 'PRESENT');
    } else if (currentX < -threshold) {
      await _markAttendance(classId, childId, 'ABSENT');
    }

    setState(() => _swipeStates.remove(childId));
  }

  Future<void> _markAttendance(String classId, String childId, String status) async {
    try {
      final today = DateTime.now().toIso8601String().split('T')[0];
      final user = Supabase.instance.client.auth.currentUser;
      if (user == null) return;

      await Supabase.instance.client.from('attendance').upsert(
        {
          'child_id': childId,
          'class_id': classId,
          'date': today,
          'status': status,
          'recorded_by': user.id,
        },
        onConflict: 'child_id,class_id,date',
      );

       ref.invalidate(staff_providers.todayAttendanceProvider(classId));
       ref.invalidate(staff_providers.staffStatsProvider);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(status == 'PRESENT' ? '✓ Marked present' : '✗ Marked absent'),
            backgroundColor: status == 'PRESENT' ? AppColors.mintGlow : Colors.red.shade400,
            duration: const Duration(milliseconds: 600),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _submitAttendance() async {
    final classes = ref.read(staff_providers.assignedClassesProvider).value;
    if (classes == null || classes.isEmpty) return;

    final classId = classes.first['id'] as String;

     try {
       final attendanceMap = await ref.read(staff_providers.todayAttendanceProvider(classId).future);
       final children = await ref.read(staff_providers.childrenInClassProvider(classId).future);
      
      final today = DateTime.now().toIso8601String().split('T')[0];
      final user = Supabase.instance.client.auth.currentUser;
      
       for (final child in children) {
         final childId = child['id'] as String;
         final status = (attendanceMap as Map<String, String>)[childId] ?? 'ABSENT';
        
        await Supabase.instance.client.from('attendance').upsert(
          {
            'child_id': childId,
            'class_id': classId,
            'date': today,
            'status': status,
            'recorded_by': user?.id,
          },
          onConflict: 'child_id,class_id,date',
        );
      }

      if (mounted) {
         ScaffoldMessenger.of(context).showSnackBar(
           const SnackBar(content: Text('✅ Attendance submitted successfully!'), backgroundColor: AppColors.mintGlow),
         );
         ref.invalidate(staff_providers.todayAttendanceProvider(classId));
         ref.invalidate(staff_providers.staffStatsProvider);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Submission failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }
}

// Swipe state model
class SwipeState {
  final double startX;
  final double startY;
  final double currentX;
  final bool swiping;

  SwipeState({
    required this.startX,
    required this.startY,
    required this.currentX,
    required this.swiping,
  });

  SwipeState copyWith({
    double? startX,
    double? startY,
    double? currentX,
    bool? swiping,
  }) {
    return SwipeState(
      startX: startX ?? this.startX,
      startY: startY ?? this.startY,
      currentX: currentX ?? this.currentX,
      swiping: swiping ?? this.swiping,
    );
  }
}
