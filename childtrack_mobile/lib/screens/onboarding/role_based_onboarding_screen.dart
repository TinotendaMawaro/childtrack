import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:lottie/lottie.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../main.dart' show UserRole, AppColors;

class RoleBasedOnboardingScreen extends StatefulWidget {
  final UserRole role;

  const RoleBasedOnboardingScreen({
    super.key,
    required this.role,
  });

  @override
  State<RoleBasedOnboardingScreen> createState() => _RoleBasedOnboardingScreenState();
}

class _RoleBasedOnboardingScreenState extends State<RoleBasedOnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  late final List<Map<String, String>> _onboardingData;

  @override
  void initState() {
    super.initState();
    _onboardingData = _getOnboardingData(widget.role);
  }

  List<Map<String, String>> _getOnboardingData(UserRole role) {
    switch (role) {
      case UserRole.parent:
        return [
          {
            'title': 'Welcome to ChildTrack!',
            'subtitle': 'Your complete childcare companion',
            'lottie': 'assets/lottie/parent_welcome.json',
            'color': 'coral',
          },
          {
            'title': 'Real-Time Attendance',
            'subtitle': 'Know when your child arrives and leaves school',
            'lottie': 'assets/lottie/attendance.json',
            'color': 'blue',
          },
          {
            'title': 'Daily Diary & Photos',
            'subtitle': 'Stay connected with daily updates and cute moments',
            'lottie': 'assets/lottie/photos.json',
            'color': 'mint',
          },
          {
            'title': 'Instant Messaging',
            'subtitle': 'Chat directly with teachers and staff',
            'lottie': 'assets/lottie/messaging.json',
            'color': 'purple',
          },
          {
            'title': 'Transport Safety',
            'subtitle': 'Track the bus in real-time for peace of mind',
            'lottie': 'assets/lottie/transport.json',
            'color': 'yellow',
          },
        ];
      case UserRole.staff:
        return [
          {
            'title': 'Welcome, Staff!',
            'subtitle': 'Your classroom management companion',
            'lottie': 'assets/lottie/staff_welcome.json',
            'color': 'blue',
          },
          {
            'title': 'Mark Attendance',
            'subtitle': 'Quickly mark present/absent with a simple toggle',
            'lottie': 'assets/lottie/staff_attendance.json',
            'color': 'mint',
          },
          {
            'title': 'Upload Daily Photos',
            'subtitle': 'Share classroom moments with parents instantly',
            'lottie': 'assets/lottie/staff_photos.json',
            'color': 'coral',
          },
          {
            'title': 'Daily Diary',
            'subtitle': 'Record activities, meals, and milestones',
            'lottie': 'assets/lottie/staff_diary.json',
            'color': 'purple',
          },
          {
            'title': 'Parent Communication',
            'subtitle': 'Send messages and updates with ease',
            'lottie': 'assets/lottie/staff_messaging.json',
            'color': 'yellow',
          },
        ];
      case UserRole.driver:
        return [
          {
            'title': 'Welcome, Driver!',
            'subtitle': 'Your route management partner',
            'lottie': 'assets/lottie/driver_welcome.json',
            'color': 'coral',
          },
          {
            'title': 'Route Overview',
            'subtitle': 'View assigned routes and stops clearly',
            'lottie': 'assets/lottie/driver_route.json',
            'color': 'blue',
          },
          {
            'title': 'Pickup & Dropoff',
            'subtitle': 'Update child status with a single tap',
            'lottie': 'assets/lottie/driver_pickup.json',
            'color': 'mint',
          },
          {
            'title': 'Emergency Contacts',
            'subtitle': 'Quick access to parents and school',
            'lottie': 'assets/lottie/driver_emergency.json',
            'color': 'purple',
          },
          {
            'title': 'Live Tracking',
            'subtitle': 'Parents can follow your location',
            'lottie': 'assets/lottie/driver_tracking.json',
            'color': 'yellow',
          },
        ];
      default:
        return [];
    }
  }

  Color _getThemeColor(String? colorName) {
    switch (colorName) {
      case 'blue':
        return AppColors.primaryBlue;
      case 'coral':
        return AppColors.primaryCoral;
      case 'mint':
        return AppColors.mintGlow;
      case 'purple':
        return AppColors.accentPurple;
      case 'yellow':
        return AppColors.accentYellow;
      case 'pink':
        return AppColors.accentPink;
      default:
        return AppColors.primaryBlue;
    }
  }

  Future<void> _completeOnboarding() async {
    // Store onboarding completion in shared_preferences for local flag
    final prefs = await SharedPreferences.getInstance();
    final session = Supabase.instance.client.auth.currentSession;
    final userId = session?.user.id ?? 'anonymous';
    await prefs.setBool('onboarding_complete_$userId', true);

    // Navigate to role-specific dashboard
    if (mounted) {
      switch (widget.role) {
        case UserRole.parent:
          context.go('/parent');
          break;
        case UserRole.staff:
          context.go('/staff');
          break;
        case UserRole.driver:
          context.go('/driver');
          break;
        default:
          context.go('/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              onPageChanged: (index) => setState(() => _currentIndex = index),
              itemCount: _onboardingData.length,
              itemBuilder: (context, index) {
                return OnboardingPage(
                  data: _onboardingData[index],
                  index: index,
                  total: _onboardingData.length,
                  onNext: _goNext,
                  onSkip: _completeOnboarding,
                  themeColor: _getThemeColor(_onboardingData[index]['color']),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(32.0),
            child: Column(
              children: [
                SmoothPageIndicator(
                  controller: _pageController,
                  count: _onboardingData.length,
                  effect: WormEffect(
                    dotColor: Colors.grey.shade300,
                    activeDotColor: _getThemeColor(_onboardingData[_currentIndex]['color']),
                    dotHeight: 10,
                    dotWidth: 10,
                  ),
                ),
                const SizedBox(height: 32),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      onPressed: _completeOnboarding,
                      child: const Text(
                        'Skip',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: _currentIndex == _onboardingData.length - 1
                          ? _completeOnboarding
                          : _goNext,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _getThemeColor(_onboardingData[_currentIndex]['color']),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                        elevation: 8,
                      ),
                      child: Text(
                        _currentIndex == _onboardingData.length - 1 ? 'Get Started' : 'Next',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _goNext() {
    if (_currentIndex < _onboardingData.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }
}

class OnboardingPage extends StatelessWidget {
  final Map<String, String> data;
  final int index;
  final int total;
  final VoidCallback onNext;
  final VoidCallback onSkip;
  final Color themeColor;

  const OnboardingPage({
    super.key,
    required this.data,
    required this.index,
    required this.total,
    required this.onNext,
    required this.onSkip,
    required this.themeColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Lottie Animation (placeholder if asset missing)
          SizedBox(
            height: 280,
            child: Lottie.asset(
              data['lottie']!,
              fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) => Container(
                  height: 250,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [themeColor.withValues(alpha: 0.3), themeColor.withValues(alpha: 0.1)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Icon(
                    Icons.arrow_forward_rounded,
                    size: 100,
                    color: themeColor.withValues(alpha: 0.6),
                  ),
                ),
            ),
          ),
          const SizedBox(height: 48),
          Text(
            data['title']!,
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              fontSize: 28,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              data['subtitle']!,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 16,
                color: AppColors.textSecondary,
                height: 1.5,
              ),
            ),
          ),
          const Spacer(),
        ],
      ),
    );
  }
}
