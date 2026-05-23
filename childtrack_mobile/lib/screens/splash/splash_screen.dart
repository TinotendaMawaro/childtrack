import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../main.dart' show AppColors;

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _logoScaleAnim;
  late Animation<double> _logoFadeAnim;
  late Animation<double> _textFadeAnim;
  late Animation<Offset> _slide1Anim;
  late Animation<Offset> _slide2Anim;
  late Animation<Offset> _slide3Anim;
  late Animation<double> _char1Bounce;
  late Animation<double> _char2Bounce;
  late Animation<double> _char3Bounce;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2800),
    );

    // Logo appears with scale + fade
    _logoScaleAnim = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.0, 0.4, curve: Curves.elasticOut)),
    );

    _logoFadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.0, 0.3, curve: Curves.easeIn)),
    );

    // Text fades in after logo
    _textFadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.4, 0.75, curve: Curves.easeInOut)),
    );

    // Children/teacher slides with bounce
    _slide1Anim = Tween<Offset>(begin: const Offset(-2.0, 0.4), end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.5, 0.8, curve: Curves.elasticOut)),
    );
    _slide2Anim = Tween<Offset>(begin: const Offset(2.0, 0.3), end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.55, 0.85, curve: Curves.elasticOut)),
    );
    _slide3Anim = Tween<Offset>(begin: const Offset(-2.0, -0.3), end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.6, 0.9, curve: Curves.elasticOut)),
    );

    // Character bounce animations
    _char1Bounce = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.8, 1.0, curve: Curves.elasticOut)),
    );
    _char2Bounce = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.85, 1.0, curve: Curves.elasticOut)),
    );
    _char3Bounce = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.9, 1.0, curve: Curves.elasticOut)),
    );

_controller.forward();

     // Check for existing session first
     final session = Supabase.instance.client.auth.currentSession;
     final destination = session != null ? '/auth/role-check' : '/login';

      // Navigate after 3 seconds total
      Future.delayed(const Duration(milliseconds: 3000), () {
       if (mounted) {
         context.go(destination);
       }
     });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF4A90E2), Color(0xFFFF7A59)],
          ),
        ),
        child: Stack(
          children: [
            // Background animated circles (soft blobs)
            _buildAnimatedBlob(0, Colors.white.withValues(alpha: 0.1), 200, 200, 0),
            _buildAnimatedBlob(1, Colors.white.withValues(alpha: 0.08), 300, 150, 1),
            _buildAnimatedBlob(2, Colors.white.withValues(alpha: 0.06), 250, 250, 2),

            // Main content
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // LOGO - Large ChildTrack logo
                  FadeTransition(
                    opacity: _logoFadeAnim,
                    child: ScaleTransition(
                      scale: _logoScaleAnim,
                      child: Container(
                        width: 160,
                        height: 160,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Colors.white, Colors.white70],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(32),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.2),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                            BoxShadow(
                              color: AppColors.mintGlow.withValues(alpha: 0.3),
                              blurRadius: 30,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(32),
                          child: Image.asset(
                            'assets/images/logo.png',
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              color: Colors.white,
                              child: const Icon(Icons.school_rounded, size: 80, color: AppColors.primaryBlue),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // App name
                  FadeTransition(
                    opacity: _textFadeAnim,
                    child: Text(
                      'ChildTrack',
                      style: GoogleFonts.poppins(
                        fontSize: 36,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: 1.2,
                        shadows: const [
                          Shadow(
                            blurRadius: 8,
                            color: Colors.black26,
                            offset: Offset(0, 3),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Tagline
                  FadeTransition(
                    opacity: _textFadeAnim,
                    child: Text(
                      'Track • Manage • Protect',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Colors.white.withValues(alpha: 0.9),
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),

                  const SizedBox(height: 60),

                  // Animated characters: child reading, child playing, teacher
                  SizedBox(
                    height: 140,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Child reading (left)
                        SlideTransition(
                          position: _slide1Anim,
                          child: ScaleTransition(
                            scale: _char1Bounce,
                            child: _buildAnimatedCharacter(
                              Icons.menu_book_rounded,
                              AppColors.accentYellow,
                              -0.6,
                            ),
                          ),
                        ),

                        // Teacher (center)
                        SlideTransition(
                          position: _slide3Anim,
                          child: ScaleTransition(
                            scale: _char3Bounce,
                            child: _buildAnimatedCharacter(
                              Icons.school_rounded,
                              AppColors.mintGlow,
                              0,
                            ),
                          ),
                        ),

                        // Child playing (right)
                        SlideTransition(
                          position: _slide2Anim,
                          child: ScaleTransition(
                            scale: _char2Bounce,
                            child: _buildAnimatedCharacter(
                              Icons.catching_pokemon_rounded,
                              AppColors.accentPink,
                              0.6,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Loading dots
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(3, (index) {
                      return TweenAnimationBuilder<double>(
                        tween: Tween(begin: 0.0, end: 1.0),
                        duration: Duration(milliseconds: 1000 + (index * 300)),
                        curve: Curves.easeInOut,
                        builder: (context, value, child) {
                          return Transform.scale(
                            scale: 0.6 + (0.4 * (1 - value)),
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 6),
                              width: 10,
                              height: 10,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.white.withValues(alpha: 0.7),
                                    blurRadius: 6,
                                    spreadRadius: 1,
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    }),
                  ),
                ],
              ),
            ),

            // Version text at bottom
            Positioned(
              bottom: 40,
              left: 0,
              right: 0,
              child: Center(
                child: Text(
                  'Version 1.0.0',
              style: TextStyle(
                fontSize: 12,
                color: Colors.white.withValues(alpha: 0.7),

                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAnimatedBlob(int index, Color color, double width, double height, int delay) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final time = _controller.value * 3.14159 * 2 + (delay * 0.5);
        final x = 150 + math.sin(time + index) * 80;
        final y = 250 + math.cos(time + index) * 60;

        return Positioned(
          left: x,
          top: y,
          child: Container(
            width: width,
            height: height,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(100),
            ),
          ),
        );
      },
    );
  }

  Widget _buildAnimatedCharacter(IconData icon, Color color, double horizontalOffset) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final bounce = math.sin(_controller.value * 5 * math.pi) * 2.0;
        return Transform.translate(
          offset: Offset(0, bounce),
          child: Container(
            width: 70,
            height: 70,
            margin: EdgeInsets.only(left: horizontalOffset < 0 ? 50.0 : 0.0, right: horizontalOffset > 0 ? 50.0 : 0.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [color.withValues(alpha: 0.95), color.withValues(alpha: 0.75)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
                BoxShadow(
                  color: Colors.white.withValues(alpha: 0.3),
                  blurRadius: 10,
                  spreadRadius: 1,
                ),
              ],
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.4),
                width: 2,
              ),
            ),
            child: Icon(
              icon,
              size: 38,
              color: Colors.white,
            ),
          ),
        );
      },
    );
  }
}
