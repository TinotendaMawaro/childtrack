import 'package:flutter/material.dart';

/// ---------------------------------------------------------------------------
/// AppLoadingScreen
///
/// A brief interstitial shown immediately after the splash (3 s) and before
/// the login screen.  Displays only the ChildTrack logo — no branding text,
/// no extra chrome — so users associate the brand with every transition.
/// ---------------------------------------------------------------------------

class AppLoadingScreen extends StatelessWidget {
  const AppLoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF4A90E2), Color(0xFFFF7A59)],
          ),
        ),
        child: const Center(
          child: Image(
            image: AssetImage('assets/images/logo.png'),
            width: 120,
            height: 120,
          ),
        ),
      ),
    );
  }
}
