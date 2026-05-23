import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:local_auth/local_auth.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color primaryBlue = Color(0xFF4A90E2);
  static const Color primaryCoral = Color(0xFFFF7A59);
  static const Color mintGlow = Color(0xFF6EE7B7);
  static const Color softBackground = Color(0xFFF5F7FB);
  static const Color white = Colors.white;
  static const Color textPrimary = Color(0xFF1E293B);
  static const Color textSecondary = Color(0xFF64748B);
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
          color: AppColors.white.withValues(alpha: 0.9),
          borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 30,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
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

// Auth state classes
abstract class AuthState {
  const AuthState();
}

class Idle extends AuthState {
  const Idle();
}

class Loading extends AuthState {
  const Loading();
}

class Success extends AuthState {
  const Success();
}

class Error extends AuthState {
  const Error(this.message);
  final String message;
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const Idle());

  Future<void> login(String email, String password) async {
    state = const Loading();
    try {
      final response = await Supabase.instance.client.auth.signInWithPassword(
        email: email,
        password: password,
      );
      // Session is managed automatically by Supabase
      if (response.session != null) {
        state = const Success();
      } else {
        state = const Error('Authentication failed');
      }
    } catch (e) {
       state = Error(e.toString());
     }
   }

   Future<void> biometricLogin() async {
     state = const Loading();
     try {
       // TODO: Implement actual biometric authentication flow
       // For now, this is a placeholder
       await Future.delayed(const Duration(seconds: 1));
       state = const Success();
     } catch (e) {
       state = Error('Biometric failed');
     }
   }
 }

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

class SharedLoginScreen extends ConsumerStatefulWidget {
  final String appTitle;
  final String? appMotto;
  final String successRoute;
  final Widget? illustration;
  final Gradient? backgroundGradient;

  const SharedLoginScreen({
    super.key,
    required this.appTitle,
    this.appMotto,
    required this.successRoute,
    this.illustration,
    this.backgroundGradient,
  });

  @override
  ConsumerState<SharedLoginScreen> createState() => _SharedLoginScreenState();
}

class _SharedLoginScreenState extends ConsumerState<SharedLoginScreen> with TickerProviderStateMixin {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  late AnimationController _shakeController;
  final LocalAuthentication _localAuth = LocalAuthentication();
  bool _termsAccepted = false;

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(vsync: this, duration: const Duration(milliseconds: 500));
  }

  @override
  void dispose() {
    _shakeController.dispose();
    super.dispose();
  }

  Future<void> _biometricLogin() async {
    try {
      final authenticated = await _localAuth.authenticate(
        localizedReason: 'Authenticate to login',
        options: const AuthenticationOptions(biometricOnly: true),
      );
      if (authenticated) {
        ref.read(authProvider.notifier).biometricLogin();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Biometric failed: $e')));
    }
  }

  void _validateAndLogin() {
    if (_emailController.text.isEmpty || !_emailController.text.contains('@')) {
      _shakeController.forward(from: 0);
      return;
    }
    if (!_termsAccepted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please accept terms')));
      return;
    }
    ref.read(authProvider.notifier).login(_emailController.text, _passwordController.text);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    ref.listen<AuthState>(authProvider, (previous, next) {
      if (next is Success) {
        context.go(widget.successRoute);
      } else if (next is Error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.message),
            backgroundColor: Colors.red.shade400,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    });

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: widget.backgroundGradient ?? const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppColors.primaryCoral, AppColors.primaryBlue],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const SizedBox(height: 40),
                // Illustration (for driver login)
                if (widget.illustration != null) ...[
                  widget.illustration!,
                  const SizedBox(height: 24),
                ],
                // Logo — icon badge (no external asset needed)
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [AppColors.primaryBlue, AppColors.primaryCoral],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.white.withValues(alpha: 0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.directions_bus_rounded,
                    size: 52,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 32),
                Text(
                  widget.appTitle,
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppColors.white,
                  ),
                ),
                const SizedBox(height: 8),
                if (widget.appMotto != null)
                  Text(
                    widget.appMotto!,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: AppColors.white.withValues(alpha: 0.8),
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                const SizedBox(height: 48),
                GlassCard(
                  child: Column(
                    children: [
                      AnimatedBuilder(
                        animation: _shakeController,
                        builder: (context, child) {
                          return Transform.translate(
                            offset: Offset(_shakeController.value * 10, 0),
                            child: TextField(
                              controller: _emailController,
                              decoration: InputDecoration(
                                labelText: 'Email',
                                prefixIcon: const Icon(Icons.email_outlined),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              keyboardType: TextInputType.emailAddress,
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _passwordController,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          prefixIcon: const Icon(Icons.lock_outlined),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        obscureText: true,
                      ),
                      const SizedBox(height: 16),
                      CheckboxListTile(
                        value: _termsAccepted,
                        onChanged: (value) => setState(() => _termsAccepted = value ?? false),
                        title: const Text('I agree to Terms & Conditions'),
                        controlAffinity: ListTileControlAffinity.leading,
                        activeColor: AppColors.mintGlow,
                        contentPadding: EdgeInsets.zero,
                        dense: true,
                      ),
                      const SizedBox(height: 24),
                          authState is Loading
                            ? Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Image(
                                    image: AssetImage('assets/images/logo.png'),
                                    width: 80,
                                    height: 80,
                                  ),
                                  const SizedBox(height: 16),
                                  const CircularProgressIndicator(color: AppColors.mintGlow, strokeWidth: 3,),
                                  const SizedBox(height: 16),
                                  Text('Logging in...', style: GoogleFonts.inter(
                                      color: AppColors.white.withValues(alpha: 0.9), fontSize: 14)),
                                ],
                              )
                        : Column(
                            children: [
                              SizedBox(
                                width: double.infinity,
                                height: 56,
                                child: FilledButton(
                                  onPressed: (_termsAccepted && _emailController.text.isNotEmpty) ? _validateAndLogin : null,
                                  style: FilledButton.styleFrom(
                                    backgroundColor: AppColors.mintGlow,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                  ),
                                  child: const Text('Login', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                ),
                              ),
                              const SizedBox(height: 16),
                              TextButton(
                                onPressed: _biometricLogin,
                                child: const Text('Use Biometric'),
                              ),
                            ],
                          ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}