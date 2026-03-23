import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

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
  await Supabase.initialize(url: supabaseUrl, anonKey: supabaseKey);
  runApp(const ChildTrackDriverApp());
}

class ChildTrackDriverApp extends StatelessWidget {
  const ChildTrackDriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    final router = GoRouter(
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const DriverLoginScreen(),
        ),
GoRoute(
          path: '/login',
          builder: (context, state) => const DriverLoginScreen(),
        ),
        GoRoute(
          path: '/home',
          builder: (context, state) => const DriverHomeScreen(),
        ),
        GoRoute(
          path: '/live',
          builder: (context, state) => const LiveRouteScreen(),
        ),
      ],
    );

    return MaterialApp.router(
      title: 'ChildTrack Driver',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF1F5F9),
        textTheme: GoogleFonts.interTextTheme(),
      ),
    );
  }
}

class DriverLoginScreen extends StatefulWidget {
  const DriverLoginScreen({super.key});

  @override
  State<DriverLoginScreen> createState() => _DriverLoginScreenState();
}

class _DriverLoginScreenState extends State<DriverLoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  var _loading = false;
  bool _termsAccepted = false;

  @override
  Widget build(Context context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppColors.primaryCoral, AppColors.primaryBlue],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppColors.primaryBlue, AppColors.primaryCoral],
                          ),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        padding: const EdgeInsets.all(4),
                        child: Container(
                          decoration: BoxDecoration(
                            color: AppColors.white,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Icon(Icons.directions_bus, size: 40, color: AppColors.primaryBlue),
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        'ChildTrack Driver',
                        style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Welcome back driver!',
                        style: TextStyle(fontSize: 18, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                GlassCard(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        TextField(
                          controller: _emailController,
                          decoration: const InputDecoration(
                            labelText: 'Email',
                            prefixIcon: Icon(Icons.email_rounded),
                            border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(20))),
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _passwordController,
                          obscureText: true,
                          decoration: const InputDecoration(
                            labelText: 'Password',
                            prefixIcon: Icon(Icons.lock_rounded),
                            border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(20))),
                          ),
                        ),
                        const SizedBox(height: 16),
                        CheckboxListTile(
                          value: _termsAccepted,
                          onChanged: (value) {
                            setState(() {
                              _termsAccepted = value ?? false;
                            });
                          },
                          title: const Text('I agree to Terms & Conditions'),
                          controlAffinity: ListTileControlAffinity.leading,
                          activeColor: AppColors.mintGlow,
                          contentPadding: EdgeInsets.zero,
                          dense: true,
                        ),
                        const SizedBox(height: 24),
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: ElevatedButton(
                            onPressed: (_loading || !_termsAccepted) ? null : _login,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.mintGlow,
                              foregroundColor: AppColors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                              elevation: 8,
                            ),
                            child: _loading 
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(AppColors.white)),
                                )
                              : const Text('Login', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _login() async {
    setState(() => _loading = true);
    try {
      await Supabase.instance.client.auth.signInWithPassword(
        email: _emailController.text,
        password: _passwordController.text,
      );
      if (mounted) {
        context.go('/home');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red.shade400,
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      setState(() => _loading = false);
    }
  }
}

class DriverHomeScreen extends StatefulWidget {
  const DriverHomeScreen({super.key});

  @override
  State<DriverHomeScreen> createState() => _DriverHomeScreenState();
}

class _DriverHomeScreenState extends State<DriverHomeScreen> {
  final List<Map<String, dynamic>> children = [
    {'name': 'Emma Johnson', 'pickup': 'Oak Street', 'picked': false},
    {'name': 'Noah Wilson', 'pickup': 'Pine Street', 'picked': false},
    {'name': 'Mason Taylor', 'pickup': 'Birch Road', 'picked': true},
  ];

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
      if (role != 'DRIVER') {
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
        if (role != 'DRIVER') {
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
              CircularProgressIndicator(color: AppColors.blueGradientEnd),
              const SizedBox(height: 16),
              Text('Verifying role...', style: TextStyle(color: AppColors.textPrimary)),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120,
            floating: true,
            pinned: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('Route A', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('8:00 AM - 9:30 AM', style: TextStyle(fontSize: 14)),
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.blueGradientStart, AppColors.blueGradientEnd],
                  ),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Start Route Button
                  GlassCard(
                    child: Container(
                      width: double.infinity,
                      height: 70,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(colors: [AppColors.blueGradientStart, AppColors.blueGradientEnd]),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.blueGradientEnd.withOpacity(0.4),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(20),
                          onTap: () {},
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.play_arrow_rounded, color: Colors.white, size: 32),
                              SizedBox(width: 12),
                              Text('Start Route', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  // Children List
                  Row(
                    children: [
                      Text(
                        'Children (${children.where((c) => c['picked']).length}/${children.length})',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ...children.map((child) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GlassCard(
                      child: Row(
                        children: [
                          Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(colors: [Colors.orange.shade400, Colors.red.shade400]),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.child_care, color: Colors.white, size: 24),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(child['name'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                                Text(child['pickup'], style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                              ],
                            ),
                          ),
                          Switch(
                            value: child['picked'],
                            onChanged: (value) => setState(() => child['picked'] = value),
                            activeColor: AppColors.blueGradientEnd,
                          ),
                        ],
                      ),
                    ),
                  )),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(20),
        child: GlassCard(
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.phone_rounded, color: Colors.white),
                  label: const Text('Emergency Call', style: TextStyle(fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.shade500,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
