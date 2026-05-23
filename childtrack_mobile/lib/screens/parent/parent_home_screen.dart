import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../main.dart' show AppColors, GlassCard;

// Providers
final parentProfileProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return null;
  
  final response = await Supabase.instance.client
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
  
  return response;
  });

  final childrenProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) return [];

    final response = await Supabase.instance.client
        .from('children')
        .select('*')
        .eq('parent_id', session.user.id)
        .order('full_name');

    return List<Map<String, dynamic>>.from((response as List).map((e) => Map<String, dynamic>.from(e as Map)));
});

final attendanceTodayProvider = FutureProvider.family<String, String>((ref, childId) async {
  final today = DateTime.now().toIso8601String().split('T')[0];
  final response = await Supabase.instance.client
      .from('attendance')
      .select('status')
      .eq('child_id', childId)
      .eq('date', today)
      .maybeSingle();
  
  return response?['status'] as String? ?? 'ABSENT';
});

final transportStatusProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return null;

  try {
    // child_transport has child_id (not parent_id) — resolve parent's children first
    final childrenResponse = await Supabase.instance.client
        .from('children')
        .select('id')
        .eq('parent_id', session.user.id)
        .limit(1);

    if (childrenResponse == null || (childrenResponse as List).isEmpty) {
      return null;
    }
    final childId = (childrenResponse as List).first['id'] as String?;
    if (childId == null) return null;

    final response = await Supabase.instance.client
        .from('child_transport')
        .select('status, pickup_time, dropoff_time, updated_at')
        .eq('child_id', childId)
        .order('updated_at', ascending: false)
        .limit(1)
        .maybeSingle();

    if (response == null) return null;
    return response as Map<String, dynamic>;
  } catch (e) {
    debugPrint('Error fetching transport status: $e');
    return null;
  }
});

class ParentHomeScreen extends ConsumerStatefulWidget {
  const ParentHomeScreen({super.key});

  @override
  ConsumerState<ParentHomeScreen> createState() => _ParentHomeScreenState();
}

class _ParentHomeScreenState extends ConsumerState<ParentHomeScreen> {
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
      if (role?.toUpperCase() != 'PARENT') {
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
      debugPrint('Role check error: $e');
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
              Text('Verifying parent access...', style: TextStyle(color: AppColors.textPrimary)),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: IndexedStack(
        index: currentIndex,
        children: const [
          HomeTab(),
          DiaryTab(),
          MessagesTab(),
          ProfileTab(),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
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
            BottomNavigationBarItem(icon: Icon(Icons.photo_album_rounded), label: 'Diary'),
            BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_rounded), label: 'Messages'),
            BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
          ],
        ),
      ),
    );
  }
}

// Home Tab with real children data
class HomeTab extends ConsumerWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final childrenAsync = ref.watch(childrenProvider);
    final parentProfile = ref.watch(parentProfileProvider);

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Greeting Header
            parentProfile.when(
              data: (profile) => Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [AppColors.primaryBlue, AppColors.primaryCoral]),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: profile?['avatar_url'] != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: Image.network(profile!['avatar_url'], fit: BoxFit.cover),
                          )
                        : const Icon(Icons.person_rounded, size: 28, color: AppColors.white),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Good morning,',
                        style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
                      ),
                      Text(
                        profile?['full_name']?.split(' ').first ?? 'Parent',
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                      ),
                    ],
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.notifications_rounded, color: AppColors.textSecondary),
                  ),
                ],
              ),
              loading: () => Row(
                children: [
                  Container(width: 56, height: 56, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(16))),
                  const SizedBox(width: 16),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Container(width: 100, height: 16, color: Colors.grey.shade300),
                    const SizedBox(height: 8),
                    Container(width: 80, height: 12, color: Colors.grey.shade300),
                  ])),
                ],
              ),
              error: (_, __) => const SizedBox(),
            ),
            const SizedBox(height: 32),

            // Quick Actions Grid
            const Text(
              'Quick Actions',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildActionCard(Icons.check_circle_rounded, 'Attendance', AppColors.mintGlow, () {}),
                _buildActionCard(Icons.location_pin, 'Transport', AppColors.primaryBlue, () {}),
                _buildActionCard(Icons.photo_camera_rounded, 'Photos', AppColors.primaryCoral, () {}),
                _buildActionCard(Icons.message_rounded, 'Messages', AppColors.accentPurple, () {}),
                _buildActionCard(Icons.payment_rounded, 'Payments', AppColors.accentYellow, () {}),
                _buildActionCard(Icons.calendar_today_rounded, 'Schedule', AppColors.accentPink, () {}),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(IconData icon, String title, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        glow: true,
        glowColor: color.withValues(alpha: 0.3),
        child: Container(
          padding: const EdgeInsets.all(8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [color.withValues(alpha: 0.6), color]),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, size: 26, color: Colors.white),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Diary Tab
class DiaryTab extends ConsumerWidget {
  const DiaryTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final childrenAsync = ref.watch(childrenProvider);
    
    return SafeArea(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Today's Updates",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                ),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.filter_list_rounded, size: 18),
                  label: const Text('Filter'),
                ),
              ],
            ),
          ),
          Expanded(
            child: childrenAsync.when(
              data: (children) {
                if (children.isEmpty) {
                  return const Center(child: Text('No children linked to your account'));
                }
                // Show static diary entries for now
                return ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    _buildDiaryCard(
                      'Arts & Crafts',
                      'Emma painted a beautiful sunset using watercolors today!',
                      '10:30 AM',
                      Colors.orange.shade400,
                    ),
                    _buildDiaryCard(
                      'Snack Time',
                      'Emma enjoyed fruits and milk with her friends.',
                      '2:00 PM',
                      Colors.green.shade400,
                    ),
                    _buildDiaryCard(
                      'Outdoor Play',
                      'Had fun on the swings and slide!',
                      '3:30 PM',
                      Colors.blue.shade400,
                    ),
                  ],
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Center(child: Text('Error: $err')),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDiaryCard(String title, String description, String time, Color color) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [color, color.withValues(alpha: 0.7)]),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.photo_camera_rounded, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                    Text(time, style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            description,
            style: const TextStyle(fontSize: 14, color: AppColors.textSecondary, height: 1.4),
          ),
        ],
      ),
    );
  }
}

// Messages Tab
class MessagesTab extends StatelessWidget {
  const MessagesTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.chat_bubble_outline_rounded, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text(
            'Messages',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 8),
          Text(
            'Connect with teachers and staff',
            style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}

// Profile Tab
class ProfileTab extends ConsumerWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final parentProfile = ref.watch(parentProfileProvider);

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 20),
            parentProfile.when(
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
                    profile?['full_name'] ?? 'Parent',
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.mintGlow.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'Parent',
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
                  _buildProfileItem(Icons.email_rounded, 'Email', parentProfile.value?['email'] ?? 'N/A'),
                  const Divider(height: 32),
                  _buildProfileItem(Icons.phone_rounded, 'Phone', parentProfile.value?['phone'] ?? 'N/A'),
                  const Divider(height: 32),
                  _buildProfileItem(Icons.home_rounded, 'Address', parentProfile.value?['address'] ?? 'Not provided'),
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
            color: AppColors.primaryBlue.withValues(alpha: 0.1),
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
