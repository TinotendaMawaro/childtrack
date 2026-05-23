import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

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
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  AuthNotifier() : super(const Idle());

  Future<void> login(String email, String password) async {
    state = const Loading();
    try {
      final response = await Supabase.instance.client.auth.signInWithPassword(
        email: email,
        password: password,
      );
      // Store token securely
      await _secureStorage.write(key: 'access_token', value: response.session?.accessToken);
      await _secureStorage.write(key: 'refresh_token', value: response.session?.refreshToken);
      state = const Success();
    } catch (e) {
      state = Error(e.toString());
    }
  }

  Future<void> biometricLogin() async {
    // Implement biometric logic if needed, but for now, assume credentials are stored
    // In a real app, store hashed credentials or use device auth
    state = const Loading();
    try {
      // Dummy biometric auth
      await Future.delayed(const Duration(seconds: 1));
      state = const Success();
    } catch (e) {
      state = Error('Biometric failed');
    }
  }

  Future<String?> getStoredToken() async {
    return await _secureStorage.read(key: 'access_token');
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});