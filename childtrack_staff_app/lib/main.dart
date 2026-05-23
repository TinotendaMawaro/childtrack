import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:image_picker/image_picker.dart';
import 'screens/attendance_screen.dart';
import 'screens/student_profile_screen.dart';
import 'screens/daily_diary_screen.dart';

const supabaseUrl = 'https://lzkhjmtfvksxobxdjytb.supabase.co';
const supabaseKey = 'sb_publishable_SoJUUnnFLEWm88VkKXnxvg_MpP9JR7c';

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
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius = 24,
    this.onTap,
    this.glow = false,
    this.glowColor,
  });

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

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: supabaseUrl,
    anonKey: supabaseKey,
  );

  runApp(const ChildTrackStaffApp());
}

class ChildTrackStaffApp extends StatelessWidget {
  const ChildTrackStaffApp({super.key});

  @override
  Widget build(BuildContext context) {
    final GoRouter router = GoRouter(
      initialLocation: '/login',
      routes: [
        GoRoute(
          path: '/login',
          builder: (context, state) => const SharedLoginScreen(
            appTitle: 'ChildTrack Staff',
            successRoute: '/staff',
          ),
        ),
        GoRoute(
          path: '/staff',
          builder: (context, state) => const StaffHomeScreen(),
        ),
      ],
      redirect: (context, state) {
        final session = Supabase.instance.client.auth.currentSession;
        if (session == null && state.uri.path != '/login') {
          return '/login';
        }
        return null;
      },
    );

    return ProviderScope(
      child: MaterialApp.router(
        title: 'ChildTrack Staff',
        debugShowCheckedModeBanner: false,
        routerConfig: router,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primaryBlue),
          scaffoldBackgroundColor: AppColors.softBackground,
          textTheme: GoogleFonts.poppinsTextTheme(),
        ),
      ),
    );
  }
}



class StaffHomeScreen extends StatefulWidget {
  const StaffHomeScreen({super.key});

  @override
  State<StaffHomeScreen> createState() => _StaffHomeScreenState();
}

class _StaffHomeScreenState extends State<StaffHomeScreen> {
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
      if (role != 'STAFF') {
        await Supabase.instance.client.auth.signOut();
        if (mounted) context.go('/login');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Access denied. Please use the correct app for your role.')),
        );
        return;
      }
    } catch (e) {
      print('Role check error: $e');
    }

    if (mounted) setState(() => _isCheckingRole = false);

    // Add auth listener
    Supabase.instance.client.auth.onAuthStateChange.listen((data) async {
      final session = data.session;
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
        if (role != 'STAFF') {
          await Supabase.instance.client.auth.signOut();
          if (mounted) context.go('/login');
        }
      } catch (e) {
        print('Auth state role check error: $e');
      }
    });
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
              Text('Verifying role...', style: TextStyle(color: AppColors.textPrimary)),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: IndexedStack(
        index: currentIndex,
        children: [
          const HomeTab(),
          const ClassesTab(),
          const MessagesTab(),
          const ProfileTab(),
        ],
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
            BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_rounded), label: 'Messages'),
            BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
          ],
        ),
      ),
    );
  }

  void _showPhotoUpload(BuildContext context) {
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
              'Upload Photo',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: GlassCard(
                    child: Icon(Icons.camera_alt_rounded, size: 32, color: AppColors.primaryBlue),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: GlassCard(
                    child: Icon(Icons.photo_library_rounded, size: 32, color: AppColors.primaryCoral),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> with SingleTickerProviderStateMixin {
  bool _isFabOpen = false;
  late AnimationController _controller;
  late Animation<double> _expandAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 400),
      reverseDuration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _expandAnimation = CurvedAnimation(
      curve: Curves.easeOutBack,
      reverseCurve: Curves.easeInBack,
      parent: _controller,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggleFab() {
    if (_isFabOpen) {
      _controller.reverse();
    } else {
      _controller.forward();
    }
    setState(() {
      _isFabOpen = !_isFabOpen;
    });
  }

  // Real data operations
  Future<void> _markAttendance() async {
    final staffId = Supabase.instance.client.auth.currentUser?.id;
    if (staffId == null) {
      _showSnackBar('Not authenticated');
      return;
    }

    final response = await Supabase.instance.client
        .from('staff')
        .select('assigned_class')
        .eq('id', staffId)
        .maybeSingle();

    if (response != null && response['assigned_class'] != null) {
      // Navigate to attendance screen with class pre-selected
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => AttendanceScreen(initialClassId: response['assigned_class']),
          ),
        );
      }
    } else {
      _showSnackBar('No classes assigned to you yet.');
    }
  }

  Future<void> _uploadPhoto() async {
    final picker = ImagePicker();
    final photos = await picker.pickMultiImage();
    if (photos.isEmpty) return;

    int uploadedCount = 0;
    for (final photo in photos) {
      final fileName = '${DateTime.now().millisecondsSinceEpoch}-${photo.name}';
      final error = await Supabase.instance.client.storage
          .from('diary-photos')
          .upload(fileName, await photo.readAsBytes());

      if (error == null) uploadedCount++;
    }
    _showSnackBar('Uploaded $uploadedCount photo(s). Use them in your diary entry!');
  }

  Future<void> _addDiary() async {
    // Navigate to Daily Diary screen
    if (mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => const DailyDiaryScreen(),
        ),
      );
    }
  }

  Future<void> _messageParent() async {
    final staffId = Supabase.instance.client.auth.currentUser?.id;
    if (staffId == null) {
      _showSnackBar('Not authenticated');
      return;
    }

    // Get staff's assigned class
    final staffResponse = await Supabase.instance.client
        .from('staff')
        .select('assigned_class')
        .eq('id', staffId)
        .maybeSingle();

    if (staffResponse == null || staffResponse['assigned_class'] == null) {
      _showSnackBar('No classes assigned to you yet.');
      return;
    }

    // Get first child in class with parent contact
    final childrenResponse = await Supabase.instance.client
        .from('children')
        .select('id, full_name, profiles!parent_id(id, full_name, phone, email)')
        .eq('class_id', staffResponse['assigned_class'])
        .eq('status', 'ACTIVE')
        .limit(1);

    if (childrenResponse.isNotEmpty && childrenResponse[0]['profiles'] != null) {
      final child = childrenResponse[0];
      final parent = child['profiles'];
      
      // Show dialog to send message
      if (mounted) {
        final controller = TextEditingController();
        final result = await showDialog<String>(
          context: context,
          builder: (context) => AlertDialog(
            title: Text('Message ${parent['full_name']} (Parent of ${child['full_name']})'),
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

        if (result != null && result.isNotEmpty) {
          // Find or create conversation
          var conv = await Supabase.instance.client
              .from('conversations')
              .select('id')
              .eq('staff_id', staffId)
              .eq('parent_id', parent['id'])
              .eq('child_id', child['id'])
              .maybeSingle();

          String? conversationId;
          if (conv != null) {
            conversationId = conv['id'];
          } else {
            final newConv = await Supabase.instance.client
                .from('conversations')
                .insert({
                  'staff_id': staffId,
                  'parent_id': parent['id'],
                  'child_id': child['id'],
                })
                .select('id')
                .maybeSingle();
            conversationId = newConv?['id'];
          }

          if (conversationId == null) {
            _showSnackBar('Failed to create conversation');
            return;
          }

          final error = await Supabase.instance.client.from('messages').insert({
            'conversation_id': conversationId,
            'sender_id': staffId,
            'receiver_id': parent['id'],
            'message': result,
          });

          if (error != null) {
            _showSnackBar('Failed to send message: ${error.message}');
          } else {
            _showSnackBar('Message sent successfully!');
          }
        }
      }
    } else {
      _showSnackBar('No children/parents found in your class.');
    }
  }

  void _showSnackBar(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Greeting
                Row(
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
                        child: const Icon(Icons.person_rounded, size: 28, color: AppColors.primaryBlue),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Good morning!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                        Text('Tap + to take action', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                // Today Summary Card (remains)
                GlassCard(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.calendar_month, size: 20, color: AppColors.primaryBlue),
                          const SizedBox(width: 8),
                          const Text('Today Summary', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                        ],
                      ),
                      const SizedBox(height: 20),
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Column(
                            children: [
                              Text('Present', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                              SizedBox(height: 4),
                              Text('12', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.accentGreen)),
                            ],
                          ),
                          Column(
                            children: [
                              Text('Absent', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                              SizedBox(height: 4),
                              Text('2', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.red)),
                            ],
                          ),
                          Column(
                            children: [
                              Text('Pending', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                              SizedBox(height: 4),
                              Text('3', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.amber)),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                // Additional content can go here
              ],
            ),
          ),

          // FAB Menu
          Positioned(
            bottom: 24,
            right: 24,
            child: _buildFabMenu(),
          ),
        ],
      ),
    );
  }

  Widget _buildFabMenu() {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        // Radial action buttons
        if (_isFabOpen) ...[
          // Backdrop overlay
          Positioned.fill(
            child: GestureDetector(
              onTap: _toggleFab,
              child: Container(
                color: Colors.black.withOpacity(0.1),
              ),
            ),
          ),

          // Buttons (order matters for z-index)
          _buildFabButton(
            icon: Icons.check_circle_rounded,
            label: 'Attendance',
            color: Colors.green,
            onTap: () {
              _markAttendance();
              _toggleFab();
            },
            delay: 1,
          ),
          _buildFabButton(
            icon: Icons.camera_alt_rounded,
            label: 'Upload',
            color: AppColors.primaryBlue,
            onTap: () {
              _uploadPhoto();
              _toggleFab();
            },
            delay: 2,
          ),
          _buildFabButton(
            icon: Icons.book_rounded,
            label: 'Diary',
            color: AppColors.primaryCoral,
            onTap: () {
              _addDiary();
              _toggleFab();
            },
            delay: 3,
          ),
          _buildFabButton(
            icon: Icons.message_rounded,
            label: 'Message',
            color: AppColors.accentPink,
            onTap: () {
              _messageParent();
              _toggleFab();
            },
            delay: 4,
          ),
        ],

        // Main FAB with pulse glow
        AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Transform.translate(
              offset: Offset.zero,
              child: FloatingActionButton(
                onPressed: _toggleFab,
                backgroundColor: AppColors.mintGlow,
                elevation: _isFabOpen ? 12 : 8,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Pulse rings when open
                    if (_isFabOpen)
                      ...List.generate(2, (i) {
                        return AnimatedBuilder(
                          animation: _controller..repeat(reverse: true),
                          builder: (context, child) {
                            return IgnorePointer(
                              child: Container(
                                width: 60 + (_controller.value * 20),
                                height: 60 + (_controller.value * 20),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: AppColors.mintGlow.withOpacity(0.3 * _controller.value),
                                ),
                              ),
                            );
                          },
                        );
                      }),
                    // Plus icon with rotation
                    Transform.rotate(
                      angle: _controller.value * 0.785, // 45 degrees
                      child: const Icon(Icons.add, size: 28, color: Colors.white),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildFabButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
    required int delay,
  }) {
    // Calculate radial position (semi-circle above FAB)
    // Order: delay 1=top, 2=top-right, 3=top-left, 4=right
    final positions = {
      1: const Offset(0, -120),   // top
      2: const Offset(90, -90),   // top-right
      3: const Offset(-90, -90),  // top-left
      4: const Offset(120, 0),    // right
    };
    
    final target = positions[delay]!;
    
    return AnimatedBuilder(
      animation: _expandAnimation,
      builder: (context, child) {
        return Positioned(
          bottom: 80,
          right: 0,
          child: Transform.translate(
            offset: target * _expandAnimation.value,
            child: Opacity(
              opacity: _expandAnimation.value,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Label
                  GlassCard(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    margin: const EdgeInsets.only(bottom: 8),
                    child: Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                  ),
                  // Button
                  GestureDetector(
                    onTap: onTap,
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(colors: [AppColors.mintGlow, Color(0xFF6EE7B7)]), // default, will override
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: color.withOpacity(0.5),
                            blurRadius: 16,
                            spreadRadius: 3,
                          ),
                        ],
                      ),
                      child: Icon(icon, color: Colors.white, size: 24),
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
}

// Placeholder tabs
class ClassesTab extends StatelessWidget {
  const ClassesTab({super.key});

  @override
  Widget build(BuildContext context) {
    return AttendanceScreen();
  }
}

class MessagesTab extends StatelessWidget {
  const MessagesTab({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Messages'));
  }
}

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Profile'));
  }
}
