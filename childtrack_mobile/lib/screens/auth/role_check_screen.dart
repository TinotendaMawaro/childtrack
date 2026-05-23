import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../main.dart' show UserRole, AppColors;

class RoleCheckScreen extends ConsumerStatefulWidget {
  const RoleCheckScreen({super.key});

  @override
  ConsumerState<RoleCheckScreen> createState() => _RoleCheckScreenState();
}

class _RoleCheckScreenState extends ConsumerState<RoleCheckScreen> {
  @override
  void initState() {
    super.initState();
    _determineRoute();
  }

  Future<void> _determineRoute() async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) {
      if (mounted) context.go('/login');
      return;
    }

    try {
      // Fetch role from profile (first_login column may not exist)
      final response = await Supabase.instance.client
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

      final role = (response['role'] as String?)?.toUpperCase() ?? 'PARENT';
      
      // Default to first login for all users since column doesn't exist
      const firstLogin = true;

      // Check if user has completed onboarding before (using SharedPreferences)
      final prefs = await SharedPreferences.getInstance();
      final hasCompletedOnboarding = prefs.getBool('onboarding_complete_${session.user.id}') ?? false;

      // Route based on role and onboarding status
      if (firstLogin && !hasCompletedOnboarding) {
        // Navigate to role-specific onboarding
        if (mounted) {
          switch (role) {
            case 'PARENT':
              context.go('/onboarding', extra: UserRole.parent);
              break;
            case 'STAFF':
              context.go('/onboarding', extra: UserRole.staff);
              break;
            case 'DRIVER':
              context.go('/onboarding', extra: UserRole.driver);
              break;
            default:
              // Unknown role - logout
              await Supabase.instance.client.auth.signOut();
              if (mounted) context.go('/login');
          }
        }
      } else {
        // Skip onboarding, go directly to dashboard
        if (mounted) {
          switch (role) {
            case 'PARENT':
              context.go('/parent');
              break;
            case 'STAFF':
              context.go('/staff');
              break;
            case 'DRIVER':
              context.go('/driver');
              break;
            default:
              await Supabase.instance.client.auth.signOut();
              if (mounted) context.go('/login');
          }
        }
      }
    } catch (e) {
      debugPrint('Error determining route: $e');
      // Only redirect to login on auth/session errors, not on schema or query errors
      final message = e.toString();
      if (message.contains('Session') || message.contains('JWT') || message.contains('token')) {
        await Supabase.instance.client.auth.signOut();
        if (mounted) context.go('/login');
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('An error occurred. Please try again.'),
              backgroundColor: Colors.red.shade400,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppColors.primaryBlue, AppColors.primaryCoral],
          ),
        ),
        child: Center(
child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 80,
                  height: 80,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          image: const DecorationImage(
                            image: AssetImage('assets/images/logo.png'),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      const CircularProgressIndicator(
                        strokeWidth: 3,
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.white),
                        backgroundColor: Colors.transparent,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                const Text(
                  'Loading your experience...',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.white,
                  ),
                ),
              const SizedBox(height: 8),
              const Text(
                'Please wait',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
