import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_ui/shared_login_screen.dart';

// Screens from different roles
import 'screens/staff/staff_home_screen.dart';
import 'screens/staff/daily_diary_screen.dart';
import 'screens/staff/messages_screen.dart';
import 'screens/driver/driver_home_screen.dart';
import 'screens/driver/live_route_screen.dart';
import 'screens/parent/parent_home_screen.dart';
import 'screens/splash/splash_screen.dart';
import 'screens/auth/role_check_screen.dart';
import 'screens/onboarding/role_based_onboarding_screen.dart';

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
  static const Color errorRed = Color(0xFFEF4444);
}

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final VoidCallback? onTap;
  final bool glow;
  final Color? glowColor;
  final double blurSigma;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius = 24,
    this.onTap,
    this.glow = false,
    this.glowColor,
    this.blurSigma = 20,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: AppColors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 30,
            offset: const Offset(0, 8),
          ),
          if (glow && glowColor != null)
            BoxShadow(
              color: glowColor!.withValues(alpha: 0.4),
              blurRadius: 20,
              spreadRadius: 2,
            ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blurSigma, sigmaY: blurSigma),
          child: Container(
            padding: padding ?? const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(borderRadius),
              border: Border.all(
                color: AppColors.white.withValues(alpha: 0.2),
                width: 1,
              ),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

// Role enum
enum UserRole { admin, staff, driver, parent }

class ChildTrackMobileApp extends StatefulWidget {
  const ChildTrackMobileApp({super.key});

  @override
  State<ChildTrackMobileApp> createState() => _ChildTrackMobileAppState();
}

class _ChildTrackMobileAppState extends State<ChildTrackMobileApp> {
  late GoRouter _router;

  @override
  void initState() {
    super.initState();
    _initializeRouter();
  }

  void _initializeRouter() {
    _router = GoRouter(
      initialLocation: '/splash',
      routes: [
        // Splash Screen
        GoRoute(
          path: '/splash',
          builder: (context, state) => const SplashScreen(),
        ),
        // Login Screen
        GoRoute(
          path: '/login',
          builder: (context, state) => const SharedLoginScreen(
            appTitle: 'ChildTrack',
            appMotto: 'Track, Manage, Protect',
            successRoute: '/auth/role-check',
          ),
        ),
        // Driver Login Screen (with bus illustration and soft blue gradient)
        GoRoute(
          path: '/driver-login',
          builder: (context, state) => SharedLoginScreen(
            appTitle: 'Driver Login',
            appMotto: 'Safe Routes for Every Child',
            successRoute: '/auth/role-check',
            backgroundGradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF60A5FA),
                Color(0xFF3B82F6),
              ],
            ),
            illustration: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [AppColors.primaryBlue, AppColors.primaryCoral],
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primaryCoral.withValues(alpha: 0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: const Icon(Icons.directions_bus, size: 60, color: Colors.white),
            ),
          ),
        ),
        // Role Check Screen (intermediate)
        GoRoute(
          path: '/auth/role-check',
          builder: (context, state) => const RoleCheckScreen(),
        ),
        // Role-specific Onboarding
        GoRoute(
          path: '/onboarding',
          builder: (context, state) {
            final role = state.extra as UserRole? ?? UserRole.parent;
            return RoleBasedOnboardingScreen(role: role);
          },
        ),
        // Dashboards
        GoRoute(
          path: '/parent',
          builder: (context, state) => const ParentHomeScreen(),
        ),
        GoRoute(
          path: '/staff',
          builder: (context, state) => const StaffHomeScreen(),
        ),
        GoRoute(
          path: '/staff/diary',
          builder: (context, state) => const DailyDiaryScreen(),
        ),
        GoRoute(
          path: '/staff/messages',
          builder: (context, state) => const MessagesScreen(),
        ),
        GoRoute(
          path: '/staff/messages/:conversationId',
          builder: (context, state) {
            final conversationId = state.pathParameters['conversationId']!;
            final extra = state.extra as Map<String, String>?;
            return MessagesScreen(
              conversationId: conversationId,
              parentName: extra?['parentName'],
              childName: extra?['childName'],
            );
          },
        ),
        GoRoute(
          path: '/driver',
          builder: (context, state) => const DriverHomeScreen(),
        ),
        GoRoute(
          path: '/live-route',
          builder: (context, state) => const LiveRouteScreen(),
        ),
      ],
      redirect: (context, state) {
        final session = Supabase.instance.client.auth.currentSession;
        final path = state.uri.path;

        // Not authenticated - only allow splash, login, or onboarding
        if (session == null) {
          if (path == '/splash' || path == '/login') return null;
          return '/login';
        }

        // Authenticated - prevent access to login/splash
        if (path == '/splash' || path == '/login') {
          return '/auth/role-check';
        }

        // All other routes are allowed; each screen validates role internally
        return null;
      },
    );
   }

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: MaterialApp.router(
        title: 'ChildTrack',
        debugShowCheckedModeBanner: false,
        routerConfig: _router,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primaryBlue,
            brightness: Brightness.light,
          ),
          scaffoldBackgroundColor: AppColors.softBackground,
          textTheme: GoogleFonts.poppinsTextTheme().copyWith(
            displayLarge: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 32),
            displayMedium: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 28),
            displaySmall: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 24),
            headlineMedium: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 20),
            headlineSmall: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 18),
            titleLarge: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 16),
            bodyMedium: GoogleFonts.inter(fontWeight: FontWeight.normal, fontSize: 14),
            bodySmall: GoogleFonts.inter(fontWeight: FontWeight.normal, fontSize: 12),
          ),
        ),
      ),
    );
  }
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(url: supabaseUrl, anonKey: supabaseKey);
  runApp(const ChildTrackMobileApp());
}