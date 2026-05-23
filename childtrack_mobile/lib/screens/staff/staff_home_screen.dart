import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../main.dart' show AppColors, GlassCard, UserRole;

// Import other screens
import 'attendance_screen.dart';
import 'daily_diary_screen.dart';
import 'messages_screen.dart';

// ============================================================================
// PROVIDERS
// ============================================================================

/// Staff profile provider
final staffProfileProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return null;

  final response = await Supabase.instance.client
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

  return response as Map<String, dynamic>?;
});

/// Assigned classes provider for staff
final assignedClassesProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return [];

  // Get staff record to find assigned class
  final staffResponse = await Supabase.instance.client
      .from('staff')
      .select('assigned_class')
      .eq('id', session.user.id)
      .maybeSingle();

  if (staffResponse == null || staffResponse['assigned_class'] == null) {
    return [];
  }

  final classId = staffResponse['assigned_class'];
  final classResponse = await Supabase.instance.client
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

  return [classResponse as Map<String, dynamic>];
});

/// Children in a specific class provider
final childrenInClassProvider = FutureProvider.family<List<Map<String, dynamic>>, String>((ref, classId) async {
  final response = await Supabase.instance.client
      .from('children')
      .select('*')
      .eq('class_id', classId)
      .order('full_name');

  return List<Map<String, dynamic>>.from(response ?? []);
});

/// Today's attendance for a class provider
final todayAttendanceProvider = FutureProvider.family<Map<String, String>, String>((ref, classId) async {
  final today = DateTime.now().toIso8601String().split('T')[0];
  final session = Supabase.instance.client.auth.currentSession;

  final response = await Supabase.instance.client
      .from('attendance')
      .select('child_id, status')
      .eq('class_id', classId)
      .eq('date', today);

  final Map<String, String> attendanceMap = {};
  for (var record in response as List) {
    attendanceMap[record['child_id']] = record['status'] as String;
  }

  return attendanceMap;
});

/// Staff statistics provider
final staffStatsProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final classList = await ref.watch(assignedClassesProvider.future);
  if (classList.isEmpty) {
    return {
      'totalClasses': 0,
      'totalChildren': 0,
      'presentToday': 0,
      'attendanceRate': 0.0,
    };
  }

  final classId = classList.first['id'] as String;
  final children = await ref.watch(childrenInClassProvider(classId).future);
  final attendance = await ref.watch(todayAttendanceProvider(classId).future);

  final presentCount = attendance.values.where((status) => status == 'PRESENT').length;
  final totalChildren = children.length;
  final rate = totalChildren > 0 ? (presentCount / totalChildren) : 0.0;

  return {
    'totalClasses': classList.length,
    'totalChildren': totalChildren,
    'presentToday': presentCount,
    'attendanceRate': rate,
  };
});

// ============================================================================
// MESSAGING PROVIDERS
// ============================================================================

/// Parent conversations for staff
final conversationsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return [];

  // Get staff record to find assigned class
  final staffResponse = await Supabase.instance.client
      .from('staff')
      .select('assigned_class')
      .eq('id', session.user.id)
      .maybeSingle();

  if (staffResponse == null || staffResponse['assigned_class'] == null) {
    return [];
  }

  final classId = staffResponse['assigned_class'];

  // Get children in this class
  final childrenResponse = await Supabase.instance.client
      .from('children')
      .select('id, full_name, photo_url')
      .eq('class_id', classId);

  final children = List<Map<String, dynamic>>.from(childrenResponse ?? []);

  // For each child, get their parent(s)
  final List<Map<String, dynamic>> parentConversations = [];

  for (final child in children) {
    final childId = child['id'] as String;
    final parentLinks = await Supabase.instance.client
        .from('child_parent_links')
        .select('parent_id')
        .eq('child_id', childId);

    if (parentLinks != null) {
      for (final link in parentLinks) {
        final parentId = link['parent_id'] as String;
        // Get parent profile
        final parentProfile = await Supabase.instance.client
            .from('profiles')
            .select('full_name')
            .eq('id', parentId)
            .maybeSingle();

        // Check if conversation already exists
        final existing = await Supabase.instance.client
            .from('conversations')
            .select('id, last_message, last_message_time')
            .eq('staff_id', session.user.id)
            .eq('parent_id', parentId)
            .eq('child_id', childId)
            .maybeSingle();

        if (existing != null) {
          parentConversations.add({
            'id': existing['id'],
            'parent_id': parentId,
            'child_id': childId,
            'child_name': child['full_name'],
            'child_photo': child['photo_url'],
            'parent_name': parentProfile?['full_name'] ?? 'Parent',
            'last_message': existing['last_message'] ?? '',
            'last_message_time': existing['last_message_time'],
          });
        } else {
          parentConversations.add({
            'id': null,
            'parent_id': parentId,
            'child_id': childId,
            'child_name': child['full_name'],
            'child_photo': child['photo_url'],
            'parent_name': parentProfile?['full_name'] ?? 'Parent',
            'last_message': 'No messages yet',
            'last_message_time': null,
          });
        }
      }
    }
  }

  // Sort by last message time (newest first)
  parentConversations.sort((a, b) {
    final timeA = a['last_message_time'] as String?;
    final timeB = b['last_message_time'] as String?;
    if (timeA == null && timeB == null) return 0;
    if (timeA == null) return 1;
    if (timeB == null) return -1;
    return timeB.compareTo(timeA);
  });

  return parentConversations;
});

/// Messages for a conversation provider
final messagesProvider = FutureProvider.family<List<Map<String, dynamic>>, String>((ref, conversationId) async {
  if (conversationId.isEmpty) return [];

  final response = await Supabase.instance.client
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', ascending: true);

  return List<Map<String, dynamic>>.from(response ?? []);
});

/// Unread count for a conversation provider
final unreadCountProvider = FutureProvider.family<int, String>((ref, conversationId) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return 0;

  final count = await Supabase.instance.client
      .from('messages')
      .count()
      .eq('conversation_id', conversationId)
      .eq('receiver_id', session.user.id)
      .eq('read', false);

  return count ?? 0;
});

// ============================================================================
// STAFF HOME SCREEN
// ============================================================================

class StaffHomeScreen extends ConsumerStatefulWidget {
  const StaffHomeScreen({super.key});

  @override
  ConsumerState<StaffHomeScreen> createState() => _StaffHomeScreenState();
}

class _StaffHomeScreenState extends ConsumerState<StaffHomeScreen> {
  int currentIndex = 0;
  bool _isCheckingRole = true;

  @override
  void initState() {
    super.initState();
    _checkRole();
  }

  Future<void> _checkRole() async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) {
      if (mounted) context.go('/login');
      return;
    }

    try {
      final response = await Supabase.instance.client
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

      final role = response['role'] as String?;
      if (role?.toUpperCase() != 'STAFF') {
        await Supabase.instance.client.auth.signOut();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Access denied. Please use correct portal for your role.')),
          );
          context.go('/login');
        }
        return;
      }
    } catch (e) {
      print('Role check error: $e');
    }

    if (mounted) setState(() => _isCheckingRole = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_isCheckingRole) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: AppColors.primaryBlue),
              const SizedBox(height: 16),
              Text('Verifying staff access...', style: TextStyle(color: AppColors.textPrimary)),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: IndexedStack(
        index: currentIndex,
        children: [
          HomeTab(
            onTabChange: (index) => setState(() => currentIndex = index),
            onShowUpload: () => _showQuickUploadSheet(context),
          ),
          const ClassesTab(),
          const AttendanceScreen(),
          const MessagesTab(),
          const ProfileTab(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showQuickUploadSheet(context),
        backgroundColor: AppColors.mintGlow,
        child: const Icon(Icons.camera_alt_rounded, color: AppColors.white, size: 28),
      ),
      bottomNavigationBar: _buildBottomNav(),
      extendBody: true,
    );
  }

  Widget _buildBottomNav() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white.withOpacity(0.9),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 30,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: (index) => setState(() => currentIndex = index),
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: AppColors.primaryBlue,
          unselectedItemColor: AppColors.textSecondary,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.school_rounded), label: 'Classes'),
            BottomNavigationBarItem(icon: Icon(Icons.check_circle_rounded), label: 'Attendance'),
            BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_rounded), label: 'Messages'),
            BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
          ],
        ),
      ),
    );
  }

  void _showQuickUploadSheet(BuildContext context) {
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
            Text(
              'Quick Upload',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: _buildUploadOption(Icons.camera_alt_rounded, 'Take Photo', AppColors.primaryBlue, () {}),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildUploadOption(Icons.photo_library_rounded, 'From Gallery', AppColors.primaryCoral, () {}),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildUploadOption(Icons.description_rounded, 'Update Diary', AppColors.mintGlow, () {}),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildUploadOption(Icons.message_rounded, 'Send Message', AppColors.accentPurple, () {}),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUploadOption(IconData icon, String label, Color color, VoidCallback onTap) {
    return GlassCard(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20),
        child: Column(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 24, color: color),
            ),
            const SizedBox(height: 12),
            Text(
              label,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// HOME TAB
// ============================================================================

class HomeTab extends ConsumerWidget {
  final ValueChanged<int> onTabChange;
  final VoidCallback onShowUpload;

  const HomeTab({
    super.key,
    required this.onTabChange,
    required this.onShowUpload,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final staffProfile = ref.watch(staffProfileProvider);
    final statsAsync = ref.watch(staffStatsProvider);
    final assignedClasses = ref.watch(assignedClassesProvider);

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Greeting Header with Notifications
            staffProfile.when(
              data: (profile) => Row(
                children: [
                  // Logo
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    padding: const EdgeInsets.all(2),
                    child: Container(
                      decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(14)),
                      child: profile?['avatar_url'] != null
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: Image.network(profile!['avatar_url'], fit: BoxFit.cover),
                            )
                          : const Icon(Icons.person_rounded, size: 28, color: AppColors.primaryBlue),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Good morning,',
                          style: TextStyle(fontSize: 14, color: AppColors.textSecondary, fontFamily: 'Poppins'),
                        ),
                        Text(
                          profile?['full_name']?.split(' ')?.first ?? 'Teacher',
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontFamily: 'Poppins'),
                        ),
                      ],
                    ),
                  ),
                  // Notifications with Glow Badge
                  Stack(
                    children: [
                      IconButton(
                        onPressed: () => _showNotificationsSheet(context),
                        icon: const Icon(Icons.notifications_rounded, color: AppColors.textSecondary, size: 28),
                      ),
                      Positioned(
                        right: 8,
                        top: 8,
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: AppColors.mintGlow,
                            borderRadius: BorderRadius.circular(5),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.mintGlow.withOpacity(0.6),
                                blurRadius: 6,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              loading: () => const SizedBox(),
              error: (_, __) => const SizedBox(),
            ),

            const SizedBox(height: 32),

            // Today's Class Card
            const Text(
              "Today's Class",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontFamily: 'Poppins'),
            ),
            const SizedBox(height: 16),
            assignedClasses.when(
              data: (classes) {
                if (classes.isEmpty) {
                  return GlassCard(
                    child: Container(
                      padding: const EdgeInsets.all(40),
                      child: Column(
                        children: [
                          Icon(Icons.school_outlined, size: 80, color: Colors.grey.shade300),
                          const SizedBox(height: 20),
                          Text(
                            'No class assigned',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.grey.shade600, fontFamily: 'Poppins'),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Contact admin to get assigned',
                            style: TextStyle(fontSize: 14, color: Colors.grey.shade500, fontFamily: 'Inter'),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                final classId = classes.first['id'] as String;
                final className = classes.first['name'] ?? 'Unknown Class';
                final childrenAsync = ref.watch(childrenInClassProvider(classId));
                final attendanceAsync = ref.watch(todayAttendanceProvider(classId));

                return GlassCard(
                  glow: true,
                  glowColor: AppColors.primaryBlue.withOpacity(0.15),
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Icon(Icons.school_rounded, color: Colors.white, size: 28),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    className,
                                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontFamily: 'Poppins'),
                                  ),
                                  childrenAsync.when(
                                    data: (children) => Text(
                                      '${children.length} children enrolled',
                                      style: TextStyle(fontSize: 14, color: AppColors.textSecondary, fontFamily: 'Inter'),
                                    ),
                                    loading: () => const Text('Loading...', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                                    error: (_, __) => const Text('Error', style: TextStyle(fontSize: 14, color: Colors.red)),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        // Attendance Progress Section
                        const Text(
                          'Attendance Progress',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textSecondary, fontFamily: 'Poppins'),
                        ),
                        const SizedBox(height: 16),
                        attendanceAsync.when(
                          data: (attendance) {
                            final childrenList = childrenAsync.value ?? [];
                            final total = childrenList.length;
                            final present = attendance.values.where((s) => s == 'PRESENT').length;
                            final marked = attendance.length;
                            final percentage = total > 0 ? (marked / total * 100) : 0.0;

                            return Column(
                              children: [
                                // Progress Bar
                                Container(
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade200,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Stack(
                                    children: [
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(6),
                                        child: LinearProgressIndicator(
                                          value: percentage / 100,
                                          backgroundColor: Colors.transparent,
                                          valueColor: AlwaysStoppedAnimation<Color>(AppColors.mintGlow),
                                          minHeight: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    _buildAttendanceChip(Icons.check_circle_rounded, 'Present', present, AppColors.mintGlow),
                                    _buildAttendanceChip(Icons.cancel_rounded, 'Absent', total - present, AppColors.errorRed),
                                  ],
                                ),
                              ],
                            );
                          },
                          loading: () => const SizedBox(height: 80, child: Center(child: CircularProgressIndicator(strokeWidth: 2))),
                          error: (_, __) => const Text('Error loading attendance', style: TextStyle(color: Colors.red)),
                        ),
                        const SizedBox(height: 20),
                        // Mark Attendance Button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () => onTabChange(2),
                            icon: const Icon(Icons.check_circle_rounded, size: 20),
                            label: const Text('Mark Attendance', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, fontFamily: 'Poppins')),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.mintGlow,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              elevation: 8,
                              shadowColor: AppColors.mintGlow.withOpacity(0.6),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
              loading: () => const Center(child: SizedBox(height: 200, child: CircularProgressIndicator())),
              error: (_, __) => const SizedBox(),
            ),

            const SizedBox(height: 28),

            // Quick Actions Grid
            const Text(
              'Quick Actions',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontFamily: 'Poppins'),
            ),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildActionCard(Icons.check_circle_rounded, 'Mark Attendance', AppColors.mintGlow, () => onTabChange(2)),
                _buildActionCard(Icons.camera_alt_rounded, 'Upload Photos', AppColors.primaryBlue, onShowUpload),
                _buildActionCard(Icons.book_rounded, 'Add Diary Entry', AppColors.primaryCoral, () {
                  context.push('/staff/diary');
                }),
                _buildActionCard(Icons.message_rounded, 'Message Parent', AppColors.accentPurple, () => onTabChange(3)),
              ],
            ),

            const SizedBox(height: 28),

            // Today's Summary Card
            const Text(
              "Today's Summary",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontFamily: 'Poppins'),
            ),
            const SizedBox(height: 16),
            statsAsync.when(
              data: (stats) => GlassCard(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildSummaryStat(Icons.check_circle_rounded, 'Present', stats['presentToday'].toString(), AppColors.mintGlow),
                          _buildSummaryStat(Icons.cancel_rounded, 'Absent', (stats['totalChildren'] - stats['presentToday']).toString(), AppColors.errorRed),
                          _buildSummaryStat(Icons.pending_rounded, 'Pending', '0', AppColors.accentYellow),
                        ],
                      ),
                      const SizedBox(height: 20),
                      // Overall progress
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Overall Attendance',
                                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textSecondary, fontFamily: 'Poppins'),
                              ),
                              Text(
                                '${(stats['attendanceRate'] * 100).toStringAsFixed(0)}%',
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.mintGlow, fontFamily: 'Poppins'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Container(
                            height: 8,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade200,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Stack(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(4),
                                  child: LinearProgressIndicator(
                                    value: stats['attendanceRate'] as double,
                                    backgroundColor: Colors.transparent,
                                    valueColor: AlwaysStoppedAnimation<Color>(AppColors.mintGlow),
                                    minHeight: 8,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              loading: () => const SizedBox(height: 200, child: Center(child: CircularProgressIndicator())),
              error: (_, __) => const SizedBox(),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildAttendanceChip(IconData icon, String label, int count, Color color) {
    return Row(
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(width: 6),
        Text(
          '$count $label',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: color,
            fontFamily: 'Inter',
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryStat(IconData icon, String label, String value, Color color) {
    return Column(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Icon(icon, size: 24, color: color),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
            fontFamily: 'Poppins',
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: AppColors.textSecondary,
            fontFamily: 'Inter',
          ),
        ),
      ],
    );
  }

  void _showNotificationsSheet(BuildContext context) {
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
              'Notifications',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontFamily: 'Poppins'),
            ),
            const SizedBox(height: 16),
            const ListTile(
              leading: Icon(Icons.info_rounded, color: AppColors.primaryBlue),
              title: Text('No new notifications', style: TextStyle(fontFamily: 'Poppins')),
              subtitle: Text('You\'re all caught up!', style: TextStyle(fontFamily: 'Inter')),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// ACTION CARD WIDGET
// ============================================================================

Widget _buildActionCard(IconData icon, String title, Color color, VoidCallback onTap) {
  return StatefulBuilder(
    builder: (context, setState) {
      bool _isPressed = false;

      return GestureDetector(
        onTapDown: (_) => setState(() => _isPressed = true),
        onTapUp: (_) => setState(() => _isPressed = false),
        onTapCancel: () => setState(() => _isPressed = false),
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeInOut,
          transform: Matrix4.translationValues(0, _isPressed ? 4 : 0, 0),
          child: GlassCard(
            glow: _isPressed,
            glowColor: AppColors.mintGlow.withOpacity(0.4),
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.elasticOut,
                  width: _isPressed ? 52 : 48,
                  height: _isPressed ? 52 : 48,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [color.withOpacity(0.7), color],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.4),
                        blurRadius: _isPressed ? 12 : 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(icon, size: _isPressed ? 28 : 26, color: Colors.white),
                ),
                const SizedBox(height: 12),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                    letterSpacing: 0.3,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    },
  );
}

// ============================================================================
// CLASSES TAB
// ============================================================================

class ClassesTab extends ConsumerWidget {
  const ClassesTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final assignedClassesAsync = ref.watch(assignedClassesProvider);
    final staffProfileAsync = ref.watch(staffProfileProvider);

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            // Header
            staffProfileAsync.when(
              data: (profile) => Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    padding: const EdgeInsets.all(2),
                    child: Container(
                      decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(14)),
                      child: profile?['avatar_url'] != null
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: Image.network(profile!['avatar_url'], fit: BoxFit.cover),
                            )
                          : const Icon(Icons.person_rounded, size: 28, color: AppColors.primaryBlue),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Good morning,',
                          style: TextStyle(fontSize: 14, color: AppColors.textSecondary, fontFamily: 'Poppins'),
                        ),
                        Text(
                          profile?['full_name'] ?? 'Staff Member',
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontFamily: 'Poppins'),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.notifications_rounded, color: AppColors.textSecondary),
                  ),
                ],
              ),
              loading: () => const SizedBox(),
              error: (_, __) => const SizedBox(),
            ),
            const SizedBox(height: 32),

            // Page Title
            const Text(
              'My Classes',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontFamily: 'Poppins'),
            ),
            const SizedBox(height: 8),
            Text(
              'Classes assigned to you',
              style: TextStyle(fontSize: 14, color: AppColors.textSecondary, fontFamily: 'Inter'),
            ),
            const SizedBox(height: 24),

            // Classes List
            assignedClassesAsync.when(
              data: (classes) {
                if (classes.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const SizedBox(height: 60),
                        Icon(Icons.school_outlined, size: 100, color: Colors.grey.shade300),
                        const SizedBox(height: 24),
                        Text(
                          'No Classes Assigned',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.grey.shade700, fontFamily: 'Poppins'),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Contact admin to get assigned to classes',
                          style: TextStyle(fontSize: 14, color: Colors.grey.shade500, fontFamily: 'Inter'),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: classes.length,
                  itemBuilder: (context, index) {
                    final cls = classes[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: GlassCard(
                        glow: true,
                        glowColor: AppColors.primaryBlue.withOpacity(0.2),
                        child: Container(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    width: 56,
                                    height: 56,
                                    decoration: BoxDecoration(
                                      gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: const Icon(Icons.school_rounded, color: Colors.white, size: 28),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          cls['name'] ?? 'Unknown Class',
                                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontFamily: 'Poppins'),
                                        ),
                                        Text(
                                          cls['curriculum'] ?? 'General',
                                          style: TextStyle(fontSize: 14, color: AppColors.textSecondary, fontFamily: 'Inter'),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              const Divider(height: 1, color: Colors.black12),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  _buildClassStat(Icons.people_rounded, 'Children', '0', AppColors.mintGlow),
                                  const Spacer(),
                                  _buildClassStat(Icons.calendar_today_rounded, 'Schedule', 'Daily', AppColors.primaryCoral),
                                  const Spacer(),
                                  _buildClassStat(Icons.check_circle_rounded, 'Attendance', '0%', AppColors.accentPurple),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
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
                      onPressed: () => ref.invalidate(assignedClassesProvider),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildClassStat(IconData icon, String label, String value, Color color) {
    return Column(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, size: 20, color: color),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
        ),
        Text(
          label,
          style: TextStyle(fontSize: 12, color: AppColors.textSecondary, fontFamily: 'Inter'),
        ),
      ],
    );
  }
}

// ============================================================================
// MESSAGES TAB
// ============================================================================

class MessagesTab extends ConsumerWidget {
  const MessagesTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversationsAsync = ref.watch(conversationsProvider);

    return Scaffold(
      body: conversationsAsync.when(
        data: (conversations) {
          if (conversations.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.chat_bubble_outline_rounded, size: 80, color: Colors.grey.shade300),
                  const SizedBox(height: 16),
                  Text(
                    'No conversations yet',
                    style: TextStyle(fontSize: 18, color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Messages with parents will appear here',
                    style: TextStyle(fontSize: 14, color: Colors.grey.shade500),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: conversations.length,
            itemBuilder: (context, index) {
              final convo = conversations[index];
              final childName = convo['child_name'] ?? 'Unknown Child';
              final parentName = convo['parent_name'] ?? 'Parent';
              final lastMessage = convo['last_message'] ?? '';
              final lastTime = convo['last_message_time'] as String?;
              final formattedTime = lastTime != null
                  ? DateTime.parse(lastTime).toLocal().toString().substring(11, 16)
                  : '';

              return GlassCard(
                onTap: () async {
                  if (convo['id'] != null) {
                    context.push('/staff/messages/${convo['id']}', extra: {
                      'parentName': parentName,
                      'childName': childName,
                    });
                  } else {
                    // Create conversation on first tap
                    try {
                      final session = Supabase.instance.client.auth.currentSession;
                      if (session == null) return;

                      final newConvo = await Supabase.instance.client
                          .from('conversations')
                          .insert({
                            'staff_id': session.user.id,
                            'parent_id': convo['parent_id'],
                            'child_id': convo['child_id'],
                          })
                          .select()
                          .single();

                      final newId = newConvo['id'] as String;

                      if (context.mounted) {
                        context.push('/staff/messages/$newId', extra: {
                          'parentName': parentName,
                          'childName': childName,
                        });
                      }
                    } catch (e) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Failed to start chat: $e'), backgroundColor: Colors.red),
                        );
                      }
                    }
                  }
                },
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
                      backgroundImage: convo['child_photo'] != null
                          ? NetworkImage(convo['child_photo'])
                          : null,
                      child: convo['child_photo'] == null
                          ? Text(
                              childName.isNotEmpty ? childName[0].toUpperCase() : 'C',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primaryBlue,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  parentName,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.textPrimary,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              if (formattedTime.isNotEmpty)
                                Text(
                                  formattedTime,
                                  style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                                ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Re: $childName',
                            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            lastMessage,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey.shade600,
                              fontWeight: FontWeight.w500,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
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
                onPressed: () => ref.refresh(conversationsProvider),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// PROFILE TAB
// ============================================================================

class ProfileTab extends ConsumerWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final staffProfile = ref.watch(staffProfileProvider);

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 20),
            staffProfile.when(
              data: (profile) => Column(
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
                      borderRadius: BorderRadius.circular(40),
                    ),
                    padding: const EdgeInsets.all(4),
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(36),
                      ),
                      child: profile?['avatar_url'] != null
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(36),
                              child: Image.network(profile!['avatar_url'], fit: BoxFit.cover),
                            )
                          : const Icon(Icons.person_rounded, size: 60, color: AppColors.primaryBlue),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    profile?['full_name'] ?? 'Staff Member',
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.mintGlow.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'Staff',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.mintGlow),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
              loading: () => const CircleAvatar(radius: 60, backgroundColor: Colors.grey),
              error: (_, __) => const Icon(Icons.error_outline, size: 80, color: Colors.red),
            ),
            GlassCard(
              child: Column(
                children: [
                  _buildProfileItem(Icons.email_rounded, 'Email', staffProfile.value?['email'] ?? 'N/A'),
                  const Divider(height: 32),
                  _buildProfileItem(Icons.phone_rounded, 'Phone', staffProfile.value?['phone'] ?? 'N/A'),
                  const Divider(height: 32),
                  _buildProfileItem(Icons.badge_rounded, 'Staff ID', staffProfile.value?['id']?.toString().substring(0, 8) ?? 'N/A'),
                ],
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  await Supabase.instance.client.auth.signOut();
                  if (context.mounted) context.go('/login');
                },
                icon: const Icon(Icons.logout_rounded),
                label: const Text('Sign Out'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red.shade500,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileItem(IconData icon, String label, String value) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.primaryBlue.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: AppColors.primaryBlue, size: 20),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(fontSize: 14, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(fontSize: 16, color: AppColors.textPrimary, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ],
    );
  }
}

// Provider for selected class state
final selectedClassProvider = StateProvider<AsyncValue<String?>>((ref) {
  return const AsyncValue.data(null);
});
