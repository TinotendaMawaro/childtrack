import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_ui/shared_login_screen.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'screens/live_route_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/loading_screen.dart';

const supabaseUrl = 'https://lzkhjmtfvksxobxdjytb.supabase.co';
const supabaseKey = 'sb_publishable_SoJUUnnFLEWm88VkKXnxvg_MpP9JR7c';

// ── Admin / school emergency number ────────────────────────────────────────────
const String ADMIN_EMERGENCY_NUMBER = '0778141047';

// ---------------------------------------------------------------------------
// COLOURS
// ---------------------------------------------------------------------------

class AppColors {
  static const Color primaryBlue   = Color(0xFF4A90E2);
  static const Color primaryCoral  = Color(0xFFFF7A59);
  static const Color mintGlow      = Color(0xFF6EE7B7);
  static const Color softBackground= Color(0xFFF1F5F9);
  static const Color white         = Colors.white;
  static const Color textPrimary   = Color(0xFF1E293B);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color accentPink    = Color(0xFFFF6B9D);
  static const Color accentYellow  = Color(0xFFFFD93D);
  static const Color accentGreen   = Color(0xFF6EE7B7);
  static const Color accentPurple  = Color(0xFFA78BFA);
  static const Color errorRed      = Color(0xFFEF4444);

  static const Color blueGradientStart = Color(0xFF4A90E2);
  static const Color blueGradientEnd   = Color(0xFF3B82F6);
}

// ---------------------------------------------------------------------------
// WIDGET HELPERS
// ---------------------------------------------------------------------------

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
                    color: (glowColor ?? AppColors.mintGlow)
                        .withValues(alpha: 0.4),
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
              color: AppColors.white.withValues(alpha: 0.7),
              borderRadius: BorderRadius.circular(borderRadius),
              border: Border.all(
                color: AppColors.white.withValues(alpha: 0.5),
                width: 1,
              ),
            boxShadow: const [
              BoxShadow(
                color: Colors.black12, blurRadius: 30, offset: Offset(0, 8),
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

// ---------------------------------------------------------------------------
// SPLASH SCREEN PROVIDER — controls show / hide via Riverpod
// ---------------------------------------------------------------------------

class _SplashNotifier extends StateNotifier<bool> {
  _SplashNotifier() : super(true) {
    // Dismiss splash after exactly 3 seconds
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) state = false;
    });
  }
}

final splashCompleteProvider = StateNotifierProvider<_SplashNotifier, bool>((ref) {
  return _SplashNotifier();
});

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(url: supabaseUrl, anonKey: supabaseKey);
  runApp(const ProviderScope(child: ChildTrackDriverApp()));
}

class ChildTrackDriverApp extends ConsumerWidget {
  const ChildTrackDriverApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final showSplash = ref.watch(splashCompleteProvider);

    // ── GoRouter ────────────────────────────────────────────────────────────
    final router = GoRouter(
      initialLocation: '/',
      redirect: (context, state) async {
        final session = Supabase.instance.client.auth.currentSession;
        final location = state.uri.path;

        // ── Splash route — wait while splash is visible, then send to /loading ─
        if (location == '/' || location == '/splash') {
          if (showSplash) return null; // stay here during 3 s splash
          return '/loading';           // splash done → boarding screen
        }

        // ── Loading route — linger ~None s to show the logo, then route ──────
        if (location == '/loading') {
          // Keeps the loading screen visible for a brief moment after navigation
          await Future.delayed(const Duration(milliseconds: 600));
          return session == null ? '/login' : '/home';
        }

        // ── Unauthenticated → login ───────────────────────────────────────
        if (session == null) {
          if (location != '/login') return '/login';
          return null;
        }

        // ── Authenticated → allow home / live, kick everything else to home ─
        if (location == '/home' || location == '/live') return null;
        return '/home';
      },
      routes: [
        // ── Splash (shown for exactly 3 s) ──────────────────────────────────
        GoRoute(
          path: '/',
          builder: (context, state) => showSplash
              ? const SplashScreen()
              : const SizedBox.shrink(),
        ),

        // ── Boarding / Loading (logo-only, shown briefly post-splash) ────────
        GoRoute(
          path: '/loading',
          builder: (context, state) => const AppLoadingScreen(),
        ),

        // ── Login ──────────────────────────────────────────────────────────
        GoRoute(
          path: '/login',
          builder: (context, state) => SharedLoginScreen(
            appTitle: 'ChildTrack',
            appMotto: 'Driver Portal',
            successRoute: '/home',
            backgroundGradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [AppColors.primaryCoral, AppColors.primaryBlue],
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
              child: const Image(
                image: AssetImage('assets/images/logo.png'),
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),

        // ── Home / Dashboard ────────────────────────────────────────────────
        GoRoute(
          path: '/home',
          builder: (context, state) => const DriverHomeScreen(),
        ),

        // ── Live Route Map ──────────────────────────────────────────────────
        GoRoute(
          path: '/live',
          builder: (context, state) => LiveRouteScreen(
            routeName: state.uri.queryParameters['routeName'],
          ),
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

// ---------------------------------------------------------------------------
// DRIVER AUTH / DATA PROVIDERS
// ---------------------------------------------------------------------------

final driverProfileProvider =
    FutureProvider<Map<String, dynamic>?>((ref) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return null;

  try {
    final response = await Supabase.instance.client
        .from('profiles')
        // full_name, phone, email, avatar_url, license_number — all driver info
        .select('full_name, phone, email, avatar_url, license_number, created_at')
        .eq('id', session.user.id)
        .single();

    return response as Map<String, dynamic>;
  } catch (e) {
    print('Error fetching driver profile: $e');
    return null;
  }
});

final schoolContactProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  try {
    final admin = await Supabase.instance.client
        .from('profiles')
        .select('full_name, phone, email')
        .eq('role', 'ADMIN')
        .limit(1)
        .maybeSingle();

    return admin != null ? Map<String, dynamic>.from(admin) : null;
  } catch (e) {
    print('Error fetching school contact: $e');
    return null;
  }
});

final driverRoutesProvider =
    FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return [];

  try {
    final response = await Supabase.instance.client
        .from('transport_routes')
        .select('id, name, pickup_time, return_time, vehicle_id, status')
        .eq('driver_id', session.user.id)
        .eq('status', 'ACTIVE')
        .order('pickup_time');

    return List<Map<String, dynamic>>.from(response ?? []);
  } catch (e) {
    print('Error fetching driver routes: $e');
    return [];
  }
});

// ── Children linked to driver routes via child_transport ──────────────────────
final routeChildrenProvider =
    FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return [];

  try {
    // 1. All active route ids for this driver
    final routesRes = await Supabase.instance.client
        .from('transport_routes')
        .select('id')
        .eq('driver_id', session.user.id)
        .eq('status', 'ACTIVE');

    if (routesRes == null || (routesRes as List).isEmpty) return [];

    final routeIds = (routesRes as List).map((r) => r['id'] as String).toList();
    if (routeIds.isEmpty) return [];

    // 2. child_transport links children to those routes
    final linksRes = await Supabase.instance.client
        .from('child_transport')
        .select('child_id, status, pickup_time, updated_at')
        .inFilter('route_id', routeIds);

    final linkedChildIds = (linksRes as List?)
            ?.map((r) => r['child_id'] as String?)
            .whereType<String>()
            .toSet()
            .toList() ??
        [];

    if (linkedChildIds.isEmpty) return [];

    // 3. Fetch full child records from the children table
    final childrenRes = await Supabase.instance.client
        .from('children')
        .select('id, full_name, photo_url, transport_route_id, parent_id')
        .inFilter('id', linkedChildIds)
        .order('full_name');

    final children = List<Map<String, dynamic>>.from(childrenRes ?? []);

    // 4. Seed local picked cache
    final prefs = await SharedPreferences.getInstance();
    final pickedCache =
        prefs.getStringList('route_picked_${session.user.id}') ?? [];

    for (var child in children) {
      final childId = child['id']?.toString() ?? '';
      child['_picked'] = pickedCache.contains(childId);
    }

    // 5. Latest transport status per child from child_transport
    try {
      final childIds = children.map((c) => c['id'] as String).toList();
      if (childIds.isNotEmpty) {
        final ctRes = await Supabase.instance.client
            .from('child_transport')
            .select('child_id, status, pickup_time, updated_at')
            .inFilter('child_id', childIds)
            .order('updated_at', ascending: false);

        if (ctRes != null) {
          final latest = <String, Map<String, dynamic>>{};
          for (var rec in (ctRes as List)) {
            final cid = rec['child_id'] as String?;
            if (cid == null) continue;
            if (!latest.containsKey(cid)) {
              latest[cid] = Map<String, dynamic>.from(rec);
            }
          }
          for (var child in children) {
            final cid = child['id'] as String?;
            if (cid != null && latest.containsKey(cid)) {
              child['_transport'] = latest[cid];
            }
          }
        }
      }
    } catch (_) {}

    // 6. Fetch parent names from profiles table
    try {
      final parentIds = children
          .map((c) => c['parent_id'] as String?)
          .whereType<String>()
          .toSet()
          .toList();
      if (parentIds.isNotEmpty) {
        final parentsRes = await Supabase.instance.client
            .from('profiles')
            .select('id, full_name, phone, address')
            .inFilter('id', parentIds);

        final parentMap = <String, Map<String, dynamic>>{};
        for (var p in (parentsRes as List? ?? [])) {
          parentMap[p['id'] as String] = Map<String, dynamic>.from(p);
        }
        for (var child in children) {
          final pid = child['parent_id'] as String?;
          if (pid != null && parentMap.containsKey(pid)) {
            child['_parent'] = parentMap[pid];
          }
        }
      }
    } catch (_) {}

    return children;
  } catch (e) {
    print('Error fetching route children: $e');
    return [];
  }
});

// ---------------------------------------------------------------------------
// DRIVER HOME
// ---------------------------------------------------------------------------

// Convenience helper
void _safeGo(BuildContext context, String path, {Object? extra}) {
  if (context.mounted) context.go(path, extra: extra);
}

// ── Parse "street, city postal_code" into a short readable location ─────────
String _formatAddress(String raw) {
  if (raw.isEmpty) return '';
  try {
    final parts = raw.split(RegExp(r'\s*,\s*'));
    final street = parts.isNotEmpty ? parts[0] : '';
    if (parts.length > 1) {
      final rest = parts.sublist(1).join(', ');
      return '$street, $rest';
    }
    return street;
  } catch (_) {
    return raw;
  }
}

class DriverHomeScreen extends ConsumerStatefulWidget {
  const DriverHomeScreen({super.key});

  @override
  ConsumerState<DriverHomeScreen> createState() => _DriverHomeScreenState();
}

class _DriverHomeScreenState extends ConsumerState<DriverHomeScreen> {
  bool _isCheckingRole = true;
  bool _routeActive = false;
  bool _isEditingProfile = false;

  // ── Profile edit controllers ───────────────────────────────────────────────
  final _nameCtrl    = TextEditingController();
  final _phoneCtrl   = TextEditingController();
  final _emailCtrl   = TextEditingController();
  final _licenseCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _checkRole();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _licenseCtrl.dispose();
    super.dispose();
  }

  // ── Profile Edit ─────────────────────────────────────────────────────────────

  void _toggleProfileEdit() {
    if (_isEditingProfile) {
      setState(() {
        final profile = ref.read(driverProfileProvider).value ?? {};
        _nameCtrl.text    = (profile['full_name'] ?? '').toString();
        _phoneCtrl.text   = (profile['phone'] ?? '').toString();
        _emailCtrl.text   = (profile['email'] ?? '').toString();
        _licenseCtrl.text = (profile['license_number'] ?? '').toString();
        _isEditingProfile = false;
      });
    } else {
      final profile = ref.read(driverProfileProvider).value ?? {};
      _nameCtrl.text    = (profile['full_name'] ?? '').toString();
      _phoneCtrl.text   = (profile['phone'] ?? '').toString();
      _emailCtrl.text   = (profile['email'] ?? '').toString();
      _licenseCtrl.text = (profile['license_number'] ?? '').toString();
      setState(() => _isEditingProfile = true);
    }
  }

  Future<void> _saveProfile() async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) return;
    try {
      await Supabase.instance.client.from('profiles').update({
        'full_name':      _nameCtrl.text.trim(),
        'phone':          _phoneCtrl.text.trim(),
        'email':          _emailCtrl.text.trim(),
        'license_number': _licenseCtrl.text.trim(),
      }).eq('id', session.user.id);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully')),
        );
      }
      setState(() => _isEditingProfile = false);
      ref.invalidate(driverProfileProvider);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update profile: $e')),
        );
      }
    }
  }

  // ── Render driver profile as editable fields or read-only card ───────────────
  Widget _buildProfileEditSection() {
    final isEditing = _isEditingProfile;
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.badge_rounded,
                color: isEditing ? AppColors.primaryBlue : AppColors.textPrimary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                isEditing ? 'Edit Profile' : 'Driver Profile',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              TextButton.icon(
                onPressed: _toggleProfileEdit,
                icon: Icon(
                  isEditing ? Icons.close_rounded : Icons.edit_rounded,
                  size: 16,
                ),
                label: Text(
                  isEditing ? 'Cancel' : 'Edit',
                  style: const TextStyle(fontSize: 13),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (!isEditing)
            // ── Read-only view ─────────────────────────────────────────────
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _profileRow('Name',
                    (ref.watch(driverProfileProvider).value?['full_name'] ?? '—').toString()),
                _profileRow('Phone',
                    (ref.watch(driverProfileProvider).value?['phone'] ?? '—').toString()),
                _profileRow('Email',
                    (ref.watch(driverProfileProvider).value?['email'] ?? '—').toString()),
                _profileRow('License Number',
                    (ref.watch(driverProfileProvider).value?['license_number'] ?? '—').toString()),
              ],
            )
          else
            // ── Edit form ────────────────────────────────────────────────
            Column(
              children: [
                _profileTextFormField(
                  controller: _nameCtrl,
                  label: 'Full Name',
                  icon: Icons.person_outlined,
                ),
                const SizedBox(height: 10),
                _profileTextFormField(
                  controller: _phoneCtrl,
                  label: 'Phone',
                  icon: Icons.phone_outlined,
                  keyboard: TextInputType.phone,
                ),
                const SizedBox(height: 10),
                _profileTextFormField(
                  controller: _emailCtrl,
                  label: 'Email',
                  icon: Icons.email_outlined,
                  keyboard: TextInputType.emailAddress,
                ),
                const SizedBox(height: 10),
                _profileTextFormField(
                  controller: _licenseCtrl,
                  label: 'License Number',
                  icon: Icons.badge_outlined,
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: _saveProfile,
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.primaryBlue,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      'Save Changes',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }

  // ── Provide a read-only key:value row ───────────────────────────────────────
  Widget _profileRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textSecondary,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _profileTextFormField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboard = TextInputType.text,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboard,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor: AppColors.softBackground,
      ),
    );
  }

  // ── Auth / role guard ───────────────────────────────────────────────────────

  Future<void> _checkRole() async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) {
      _safeGo(context, '/login');
      return;
    }

    try {
      final res = await Supabase.instance.client
          .from('profiles')
          .select('role, full_name, phone, avatar_url')
          .eq('id', session.user.id)
          .single();

      final role = res['role'] as String?;
      if (role?.toUpperCase() != 'DRIVER') {
        await Supabase.instance.client.auth.signOut();
        _safeGo(context, '/login');
        return;
      }

      if (mounted) setState(() => _isCheckingRole = false);
    } catch (e) {
      print('Role check error: $e');
      if (mounted) setState(() => _isCheckingRole = false);
    }

    Supabase.instance.client.auth.onAuthStateChange.listen((data) async {
      final session = data.session;
      if (session == null) {
        _safeGo(context, '/login');
        return;
      }

      final userId = session.user?.id;
      if (userId == null) return;

      try {
        final res = await Supabase.instance.client
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();
        if ((res['role'] as String?)?.toUpperCase() != 'DRIVER') {
          await Supabase.instance.client.auth.signOut();
          _safeGo(context, '/login');
        }
      } catch (_) {}
    });
  }

  // ── Start / End Route ───────────────────────────────────────────────────────

  Future<void> _toggleRoute() async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) return;

    if (_routeActive) {
      _setRouteActive(false);
      return;
    }

    try {
      await Supabase.instance.client
          .from('transport_routes')
          .update({'status': 'INACTIVE'})
          .eq('driver_id', session.user.id)
          .eq('status', 'ACTIVE');

      final routes = await Supabase.instance.client
          .from('transport_routes')
          .select('id, name')
          .eq('driver_id', session.user.id)
          .eq('status', 'INACTIVE')
          .limit(1);

      if (routes == null || (routes as List).isEmpty) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('No route assigned. Contact admin.')),
          );
        }
        return;
      }

      final route = (routes as List).first;
      final routeId = route['id'] as String;
      final routeName = route['name'] ?? 'Route';

      await Supabase.instance.client
          .from('transport_routes')
          .update({'status': 'ACTIVE'})
          .eq('id', routeId);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Started $routeName')),
        );
      }

      _setRouteActive(true);
      ref.invalidate(driverRoutesProvider);
      ref.invalidate(routeChildrenProvider);

      // ── Navigate to the live-route map screen ──────────────────────────
      _safeGo(context, '/live', extra: {'routeName': routeName});
    } catch (e) {
      print('Error starting route: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to start route: $e')),
        );
      }
    }
  }

  void _setRouteActive(bool active) {
    if (mounted) setState(() => _routeActive = active);
  }

  // ── Toggle picked status ────────────────────────────────────────────────────

  Future<void> _onPickedChanged(
      Map<String, dynamic> child, bool picked) async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) return;

    final childId = child['id']?.toString() ?? '';
    final childName = child['full_name'] ?? 'Child';

    try {
      if (picked) {
        await Supabase.instance.client.from('child_transport').insert({
          'child_id': childId,
          'driver_id': session.user.id,
          'status': 'ONBOARD',
          'pickup_time': DateTime.now().toIso8601String(),
        });
      } else {
        await Supabase.instance.client
            .from('child_transport')
            .update({'status': 'NOT_PICKED', 'pickup_time': null})
            .eq('child_id', childId)
            .eq('driver_id', session.user.id)
            .maybeSingle();
      }

      final prefs = await SharedPreferences.getInstance();
      final pickedList =
          prefs.getStringList('route_picked_${session.user.id}') ?? [];
      if (picked && !pickedList.contains(childId)) {
        pickedList.add(childId);
      } else if (!picked) {
        pickedList.remove(childId);
      }
      await prefs.setStringList(
          'route_picked_${session.user.id}', pickedList);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('$childName ${picked ? "picked up" : "unmarked"}')),
        );
      }
    } catch (e) {
      print('Error updating pickup status: $e');
    }
  }

  // ── Profile photo picker ────────────────────────────────────────────────────

  Future<void> _updateProfilePhoto() async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) return;

    try {
      final picker = ImagePicker();
      final XFile? photo = await picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 80,
      );
      if (photo == null) return;

      final bytes = await File(photo.path).readAsBytes();
      final fileExt = photo.path.split('.').last;
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final path = '$timestamp.$fileExt';

      await Supabase.instance.client.storage
          .from('avatars')
          .uploadBinary(path, bytes,
              fileOptions: const FileOptions(cacheControl: '3600', upsert: true));

      final publicUrl = Supabase.instance.client.storage
          .from('avatars')
          .getPublicUrl(path);

      await Supabase.instance.client.from('profiles').update({
        'avatar_url': publicUrl,
      }).eq('id', session.user.id);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile photo updated')),
        );
      }
      ref.invalidate(driverProfileProvider);
    } catch (e) {
      print('Error updating profile photo: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update photo: $e')),
        );
      }
    }
  }

  // ── Emergency call — ADMIN hardcoded number + WhatsApp ──────────────────────

  Future<void> _emergencyCall() async {
    // Primary: hardcoded admin number 0778141047
    const String adminNumber = ADMIN_EMERGENCY_NUMBER;

    void _showNoNumberMessage() {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cannot place emergency call.'),
          backgroundColor: AppColors.errorRed,
        ),
      );
    }

    // 1. Call
    final callUri = Uri(scheme: 'tel', path: adminNumber.replaceAll(' ', ''));
    if (await canLaunchUrl(callUri)) {
      await launchUrl(callUri);
    } else {
      _showNoNumberMessage();
      return;
    }

    // 2. Also offer WhatsApp in a second dialog (tap-through)
    if (!mounted) return;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.phone, color: AppColors.errorRed),
            const SizedBox(width: 8),
            const Text('Also WhatsApp Admin?'),
          ],
        ),
        content: Text('Send a WhatsApp message to $adminNumber?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Not now'),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              final waUri = Uri.parse('https://wa.me/27778141047');
              launchUrl(waUri, mode: LaunchMode.externalApplication);
            },
            icon: const Icon(Icons.chat, color: Colors.white),
            label: const Text('WhatsApp', style: TextStyle(color: Colors.white)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF25D366),
            ),
          ),
        ],
      ),
    );
  }

  // ── Sign out ────────────────────────────────────────────────────────────────

  Future<void> _signOut() async {
    await Supabase.instance.client.auth.signOut();
    _safeGo(context, '/login');
  }

  // ────────────────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    final profileAsync = ref.watch(driverProfileProvider);
    final routesAsync = ref.watch(driverRoutesProvider);
    final childrenAsync = ref.watch(routeChildrenProvider);

    if (_isCheckingRole || profileAsync.isLoading) {
      return const Scaffold(
        body: Center(
          child: Image(
            image: AssetImage('assets/images/logo.png'),
            width: 100,
            height: 100,
          ),
        ),
      );
    }

    final profile = profileAsync.value ?? {'full_name': 'Driver'};
    final routes = routesAsync.value ?? [];
    final routeName =
        routes.isNotEmpty ? routes.first['name'] ?? 'Route' : 'Unassigned';
    final routeTime =
        (routes.isNotEmpty &&
                (routes.first['pickup_time'] as String?) != null)
            ? TimeOfDay(
                    hour: 8,
                    minute: 0,
                  )
                  .format(context)
            : '—';
    final children = childrenAsync.value ?? [];

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // ── App Bar ────────────────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 140,
            floating: true,
            pinned: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            actions: [
              IconButton(
                icon: const Icon(Icons.person_rounded, color: Colors.white),
                onPressed: _toggleProfileEdit,
                tooltip: _isEditingProfile ? 'Finish Editing' : 'My Profile',
              ),
              IconButton(
                icon: const Icon(Icons.logout_rounded, color: Colors.white),
                onPressed: _signOut,
                tooltip: 'Sign Out',
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              title: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.directions_bus,
                        color: Colors.white,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        routeName,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    'Pickup: $routeTime',
                    style: const TextStyle(fontSize: 14, color: Colors.white70),
                  ),
                ],
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.primaryBlue, AppColors.primaryCoral],
                  ),
                ),
              ),
            ),
            title: Row(
              children: [
                // ── Profile photo / avatar ──────────────────────────────────
                GestureDetector(
                  onTap: _updateProfilePhoto,
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [AppColors.primaryCoral, AppColors.primaryBlue],
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: profile['avatar_url'] != null
                          ? Image.network(
                              profile['avatar_url'],
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => const Icon(
                                Icons.person,
                                color: Colors.white,
                                size: 24,
                              ),
                            )
                          : const Icon(
                              Icons.person,
                              color: Colors.white,
                              size: 24,
                            ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      profile['full_name'] ?? 'Driver',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (profile['phone'] != null)
                      Text(
                        profile['phone'],
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.white70,
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          // ── Body ────────────────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Driver Profile ───────────────────────────────────────────
                  _buildProfileEditSection(),
                  const SizedBox(height: 16),

                  // ── Start / End Route ───────────────────────────────────────
                  GlassCard(
                    child: Container(
                      width: double.infinity,
                      height: 70,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: _routeActive
                              ? [AppColors.errorRed, Colors.red.shade700]
                              : [
                                  AppColors.blueGradientStart,
                                  AppColors.blueGradientEnd
                                ],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: (_routeActive
                                    ? AppColors.errorRed
                                    : AppColors.blueGradientEnd)
                                .withValues(alpha: 0.4),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(20),
                          onTap: _routeActive
                              ? () => _safeGo(
                                    context,
                                    '/home',
                                  ) // End → re-draws in ACTIVE=false state
                              : _toggleRoute, // Start → calls Supabase + navigates to /live
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                _routeActive
                                    ? Icons.stop_rounded
                                    : Icons.play_arrow_rounded,
                                color: Colors.white,
                                size: 32,
                              ),
                              const SizedBox(width: 12),
                              Text(
                                _routeActive ? 'End Route' : 'Start Route',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // ── Children count header ───────────────────────────────────
                  Text(
                    'Children (${children.where((c) => c['_picked'] == true).length}/${children.length})',
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),

                  // ── Children list ────────────────────────────────────────────
                  if (childrenAsync.isLoading)
                    const Center(
                        child: Padding(
                      padding: EdgeInsets.all(32),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image(
                            image: AssetImage('assets/images/logo.png'),
                            width: 60,
                            height: 60,
                          ),
                          SizedBox(height: 16),
                          CircularProgressIndicator(),
                        ],
                      ),
                    ))
                  else if (!childrenAsync.hasValue || children.isEmpty)
                    GlassCard(
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(40),
                        child: const Column(
                          children: [
                            Image(
                              image: AssetImage('assets/images/logo.png'),
                              width: 80,
                              height: 80,
                            ),
                            SizedBox(height: 16),
                            Text(
                              'No children assigned to your routes yet',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    ...children.map((child) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: GlassCard(
                            child: Row(
                              children: [
                                // ── Child photo ─────────────────────────────────────
                                Container(
                                  width: 50,
                                  height: 50,
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.orange.shade400,
                                        Colors.red.shade400
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child:
                                      child['photo_url'] != null &&
                                              (child['photo_url'] as String)
                                                  .isNotEmpty
                                          ? ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(12),
                                              child: Image.network(
                                                child['photo_url'],
                                                fit: BoxFit.cover,
                                                errorBuilder: (_, __, ___) =>
                                                    const Icon(
                                                      Icons.child_care,
                                                      color: Colors.white,
                                                      size: 24,
                                                    ),
                                              ),
                                            )
                                          : const Icon(
                                              Icons.child_care,
                                              color: Colors.white,
                                              size: 24,
                                            ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        child['full_name'] ?? 'Child',
                                        style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w600),
                                      ),
                                      // ── Pickup location (parsed from parent address) ──
                                      if (child['_parent']?['address'] != null)
                                        Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            const Icon(
                                              Icons.location_on_outlined,
                                              size: 12,
                                              color: AppColors.textSecondary,
                                            ),
                                            const SizedBox(width: 2),
                                            Text(
                                              _formatAddress(
                                                (child['_parent']!['address']
                                                        as String?) ??
                                                    '',
                                              ),
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: AppColors.textSecondary,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ],
                                        ),
                                      if (child['_transport'] != null)
                                        Text(
                                          child['_transport']['status'] ==
                                                      'ONBOARD' ||
                                                  child['_transport']
                                                          ['status'] ==
                                                      'DROPPED'
                                              ? 'Status: ${child['_transport']['status']}'
                                              : 'Not yet picked up',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: (child['_transport']['status']
                                                        as String?) ==
                                                    'ONBOARD'
                                                ? AppColors.mintGlow
                                                : AppColors.textSecondary,
                                          ),
                                        )
                                      else
                                        const Text(
                                          'Not yet picked up',
                                          style: TextStyle(
                                              fontSize: 12,
                                              color: AppColors.textSecondary),
                                        ),
                                    ],
                                  ),
                                ),
                                Switch(
                                  value: child['_picked'] == true,
                                  onChanged: (value) {
                                    setState(
                                        () => child['_picked'] = value);
                                    _onPickedChanged(child, value);
                                  },
                                  activeThumbColor: AppColors.primaryBlue,
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

      // ── Emergency Call button ───────────────────────────────────────────────
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(20),
        child: GlassCard(
          child: IntrinsicHeight(
            child: Row(
              children: [
                // ── Call / Phone ────────────────────────────────────────────
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _emergencyCall,
                    icon: const Icon(Icons.phone_rounded, color: Colors.white),
                    label: const Text(
                      'Emergency Call\n077 814 1047',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.errorRed,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                // ── WhatsApp ─────────────────────────────────────────────────
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      final waUri = Uri.parse('https://wa.me/27778141047');
                      launchUrl(waUri, mode: LaunchMode.externalApplication);
                    },
                    icon: const Icon(Icons.chat_rounded,
                        color: Colors.white, size: 20),
                    label: const Text(
                      'WhatsApp\nAdmin',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF25D366),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 14),
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
}
