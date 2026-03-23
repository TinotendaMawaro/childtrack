import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:lottie/lottie.dart';
import 'package:google_fonts/google_fonts.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<Map<String, String>> onboardingData = [
    {
      'title': 'Welcome to ChildTrack',
      'subtitle': 'Your complete childcare companion',
      'lottie': 'assets/lottie/welcome.json', // Add Lottie files to assets
    },
    {
      'title': 'Track Your Child',
      'subtitle': 'Real-time location & attendance updates',
      'lottie': 'assets/lottie/tracking.json',
    },
    {
      'title': 'Daily Updates',
      'subtitle': 'Photos, activities & progress reports',
      'lottie': 'assets/lottie/daily_updates.json',
    },
    {
      'title': 'Message Teachers',
      'subtitle': 'Instant communication with your teacher',
      'lottie': 'assets/lottie/messaging.json',
    },
    {
      'title': 'Transport Safety',
      'subtitle': 'Live bus tracking & safety alerts',
      'lottie': 'assets/lottie/transport.json',
    },
  ];

  Future<void> _completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarding_complete', true);
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/parent');
    }
  }

  Future<bool> _isOnboardingComplete() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('onboarding_complete') ?? false;
  }

  @override
  void initState() {
    super.initState();
    _checkOnboardingStatus();
  }

  Future<void> _checkOnboardingStatus() async {
    final complete = await _isOnboardingComplete();
    if (complete && mounted) {
      Navigator.of(context).pushReplacementNamed('/parent');
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
              itemCount: onboardingData.length,
              itemBuilder: (context, index) {
                return OnboardingPage(
                  data: onboardingData[index],
                  index: index,
                  total: onboardingData.length,
                  onNext: _goNext,
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
                  count: onboardingData.length,
                  effect: WormEffect(
                    dotColor: Colors.grey.shade300,
                    activeDotColor: const Color(0xFF4A90E2),
                    dotHeight: 8,
                    dotWidth: 8,
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
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: _currentIndex == onboardingData.length - 1 
                          ? _completeOnboarding 
                          : _goNext,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4A90E2),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                        elevation: 8,
                      ),
                      child: Text(
                        _currentIndex == onboardingData.length - 1 ? 'Get Started' : 'Next',
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
    if (_currentIndex < onboardingData.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    }
  }
}

class OnboardingPage extends StatelessWidget {
  final Map<String, String> data;
  final int index;
  final int total;
  final VoidCallback onNext;

  const OnboardingPage({
    super.key,
    required this.data,
    required this.index,
    required this.total,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Lottie Animation (placeholder - add actual Lottie files)
          SizedBox(
            height: 300,
            child: Lottie.asset(
              data['lottie']!,
              fit: BoxFit.contain,
              errorBuilder: (context, error, stackTrace) => Container(
                height: 250,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue.shade300, Colors.purple.shade300],
                  ),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Icon(
                  Icons.child_care,
                  size: 120,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 48),
          Text(
            data['title']!,
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              fontSize: 32,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF1E293B),
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Text(
              data['subtitle']!,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 18,
                color: const Color(0xFF64748B),
                height: 1.4,
              ),
            ),
          ),
          const Spacer(),
        ],
      ),
    );
  }
}

