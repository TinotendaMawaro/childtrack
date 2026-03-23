import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'screens/onboarding_screen.dart';
import 'screens/login_screen.dart'; // Add this import
import 'screens/parent_home_screen.dart'; // Add this import

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

  runApp(const ChildTrackParentApp());
}

class ChildTrackParentApp extends StatelessWidget {
  const ChildTrackParentApp({super.key});

  @override
  Widget build(BuildContext context) {
    final GoRouter router = GoRouter(
      initialLocation: '/onboarding',
      routes: [
        GoRoute(
          path: '/onboarding',
          builder: (context, state) => const OnboardingScreen(),
        ),
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/parent',
          builder: (context, state) => const ParentHomeScreen(),
        ),
      ],
      redirect: (context, state) {
        final session = Supabase.instance.client.auth.currentSession;
        if (session == null && state.location != '/login') {
          return '/login';
        }
        return null;
      },
    );

    return MaterialApp.router(
      title: 'ChildTrack Parent',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primaryBlue),
        scaffoldBackgroundColor: AppColors.softBackground,
        textTheme: GoogleFonts.interTextTheme(),
      ),
    );
  }
}

// [Keep all existing LoginScreen, ParentHomeScreen, Child, MainScreen, and other screens unchanged]

