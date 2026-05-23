import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:io';
import '../../main.dart' show AppColors, GlassCard;

// ── Admin / school emergency number ─────────────────────────────────────────────
const String adminEmergencyNumber = '0778141047';

// ────────────────────────────────────────────────────────────────────────────────
// PROVIDERS
// ────────────────────────────────────────────────────────────────────────────────

/// Fetches profile for this driver (role-validated before route is shown)
final driverProfileProvider =
    FutureProvider.family<Map<String, dynamic>?, String>((ref, userId) async {
  try {
    final response = await Supabase.instance.client
        .from('profiles')
        .select('full_name, phone, email, avatar_url, license_number')
        .eq('id', userId)
        .single();
    return response as Map<String, dynamic>;
  } catch (e) {
    debugPrint('Error fetching driver profile: $e');
    return null;
  }
});

/// Fetches ACTIVE route assigned to this driver with pickup/return times
final activeRouteProvider =
    FutureProvider.family<Map<String, dynamic>?, String>((ref, userId) async {
  try {
    final response = await Supabase.instance.client
        .from('transport_routes')
        .select('id, name, pickup_time, return_time, vehicle, status')
        .eq('driver_id', userId)
        .eq('status', 'ACTIVE')
        .order('pickup_time', ascending: false)
        .maybeSingle();
    return response != null ? Map<String, dynamic>.from(response) : null;
  } catch (e) {
    debugPrint('Error fetching active route: $e');
    return null;
  }
});

/// Children on the driver's active route:
///   1. child_transport WHERE route_id = activeRoute.id
///   2. children WHERE id IN (child_ids from step 1)  ← real DB data
///   3. profiles WHERE id = child.parent_id            ← parent name + phone for each child
final routeChildrenProvider =
    FutureProvider.family<List<Map<String, dynamic>>, String>((ref, routeId) async {
  try {
    // 1. child_transport links children to this route
    final links = await Supabase.instance.client
        .from('child_transport')
        .select('child_id, status, pickup_time')
        .eq('route_id', routeId);

    final childIds = (links as List?)
            ?.map((r) => r['child_id'] as String?)
            .whereType<String>()
            .toList() ??
        [];

    if (childIds.isEmpty) return [];

    // 2. Fetch full child records from the children table
    final childrenRes = await Supabase.instance.client
        .from('children')
        .select('id, full_name, photo_url, parent_id')
        .inFilter('id', childIds)
        .order('full_name');

    final children = List<Map<String, dynamic>>.from(childrenRes!);

    // 3. Fetch parent names / phones in one batch query
    final parentIds = children
        .map((c) => c['parent_id'] as String?)
        .whereType<String>()
        .toSet()
        .toList();
    final parentMap = <String, Map<String, dynamic>>{};
    if (parentIds.isNotEmpty) {
      final parentsRes = await Supabase.instance.client
          .from('profiles')
          .select('id, full_name, phone')
          .inFilter('id', parentIds);
      for (var p in (parentsRes as List? ?? [])) {
        parentMap[p['id'] as String] = Map<String, dynamic>.from(p);
      }
    }

    // 4. Merge child + parent data; seed picked state from cache
    final session = Supabase.instance.client.auth.currentSession;
    final prefs = session != null ? await SharedPreferences.getInstance() : null;
    final pickedCache = prefs != null
        ? (prefs.getStringList('pickup_status_${session!.user.id}') ?? [])
        : <String>[];

    return children.map((child) {
      final pid = child['parent_id'] as String?;
      return {
        ...child,
        'parent_name': pid != null && parentMap.containsKey(pid)
            ? parentMap[pid]!['full_name'] ?? ''
            : '',
        'parent_phone': pid != null && parentMap.containsKey(pid)
            ? parentMap[pid]!['phone'] ?? ''
            : '',
        'picked': pickedCache.contains(child['id']?.toString()),
      };
    }).toList();
  } catch (e) {
    debugPrint('Error fetching route children: $e');
    return [];
  }
});

// ────────────────────────────────────────────────────────────────────────────────
// DRIVER HOME SCREEN
// ────────────────────────────────────────────────────────────────────────────────

class DriverHomeScreen extends ConsumerStatefulWidget {
  const DriverHomeScreen({super.key});

  @override
  ConsumerState<DriverHomeScreen> createState() => _DriverHomeScreenState();
}

class _DriverHomeScreenState extends ConsumerState<DriverHomeScreen> {
  bool _isCheckingRole = true;
  String? _userId;
  Map<String, dynamic>? _driverProfile;
  bool _routeActive = false;
  bool _isStartingRoute = false;
  bool _isEditingProfile = false;
  final TextEditingController _nameCtrl = TextEditingController();
  final TextEditingController _phoneCtrl = TextEditingController();
  final TextEditingController _emailCtrl = TextEditingController();
  final TextEditingController _licenseCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _checkRole();
  }

  // ── Role guard ────────────────────────────────────────────────────────────────

  Future<void> _checkRole() async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) {
      if (mounted) context.go('/login');
      return;
    }

    final uid = session.user.id;
    _userId = uid;

    try {
      final res = await Supabase.instance.client
          .from('profiles')
          .select('role, full_name, phone, avatar_url, license_number')
          .eq('id', uid)
          .single();

      final role = res['role'] as String?;
      if (role?.toUpperCase() != 'DRIVER') {
        await Supabase.instance.client.auth.signOut();
        if (mounted) context.go('/login');
        return;
      }

      setState(() {
        _driverProfile = res;
        _isCheckingRole = false;
      });
    } catch (e) {
      debugPrint('Role check error: $e');
      setState(() => _isCheckingRole = false);
    }

    Supabase.instance.client.auth.onAuthStateChange.listen((data) async {
      final s = data.session;
      if (s == null) {
        if (mounted) context.go('/login');
        return;
      }
      try {
        final r = await Supabase.instance.client
            .from('profiles')
            .select('role')
            .eq('id', s.user.id)
            .single();
        if ((r['role'] as String?)?.toUpperCase() != 'DRIVER') {
          await Supabase.instance.client.auth.signOut();
          if (mounted) context.go('/login');
        }
      } catch (_) {}
    });
  }

  // ── Start / End Route ─────────────────────────────────────────────────────────

  Future<void> _toggleRoute() async {
    if (_userId == null) return;

    setState(() => _isStartingRoute = true);

    if (_routeActive) {
      // ── End route ──────────────────────────────────────────────────────────
      try {
        await Supabase.instance.client
            .from('transport_routes')
            .update({'status': 'INACTIVE'})
            .eq('driver_id', _userId!)
            .eq('status', 'ACTIVE');

        // Mark all children as dropped
        final active = await Supabase.instance.client
            .from('transport_routes')
            .select('id')
            .eq('driver_id', _userId!)
            .eq('status', 'ACTIVE');
        final routeIds = (active as List?)
                ?.map((r) => r['id'] as String)
                .toList() ??
            [];
        if (routeIds.isNotEmpty) {
          await Supabase.instance.client
              .from('child_transport')
              .update({'status': 'DROPPED', 'dropoff_time': DateTime.now().toIso8601String()})
              .inFilter('route_id', routeIds);
        }

        setState(() => _routeActive = false);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Route ended')),
          );
        }
        ref.invalidate(activeRouteProvider(_userId!));
        ref.invalidate(routeChildrenProvider);
      } catch (e) {
        debugPrint('Error ending route: $e');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error ending route: $e')),
          );
        }
      }
    } else {
      // ── Start route ────────────────────────────────────────────────────────
      try {
        // Deactivate other routes first
        await Supabase.instance.client
            .from('transport_routes')
            .update({'status': 'INACTIVE'})
            .eq('driver_id', _userId!)
            .eq('status', 'ACTIVE');

        // Find an inactive route to activate
        final routes = await Supabase.instance.client
            .from('transport_routes')
            .select('id, name, pickup_time, return_time')
            .eq('driver_id', _userId!)
            .eq('status', 'INACTIVE')
            .limit(1);

        if (routes == null || (routes as List).isEmpty) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('No route assigned. Contact admin.')),
            );
          }
          setState(() => _isStartingRoute = false);
          return;
        }

        final route = (routes as List).first;
        final routeId = route['id'] as String;
        final routeName = route['name'] ?? 'Route';

        // Activate it
        await Supabase.instance.client
            .from('transport_routes')
            .update({'status': 'ACTIVE'})
            .eq('id', routeId);

        // Log initial GPS ping
        await Supabase.instance.client.from('transport_tracking').insert({
          'driver_id': _userId!,
          'route_id': routeId,
          'latitude': null,
          'longitude': null,
        });

        setState(() => _routeActive = true);

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Started $routeName')),
          );
        }

        ref.invalidate(activeRouteProvider(_userId!));
        ref.invalidate(routeChildrenProvider);

        // Navigate to live-route map screen
        if (mounted) {
          context.go('/live-route');
        }
      } catch (e) {
        debugPrint('Error starting route: $e');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to start route: $e')),
          );
        }
      }
    }

    setState(() => _isStartingRoute = false);
  }

  // ── Pickup toggle ────────────────────────────────────────────────────────────

  Future<void> _onPickedChanged(
      Map<String, dynamic> child, bool picked) async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) return;

    final childId = child['id']?.toString() ?? '';
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
      final cached =
          prefs.getStringList('pickup_status_${session.user.id}') ?? [];
      if (picked && !cached.contains(childId)) {
        cached.add(childId);
      } else if (!picked) {
        cached.remove(childId);
      }
      await prefs.setStringList(
          'pickup_status_${session.user.id}', cached);
    } catch (e) {
      debugPrint('Error updating pickup: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not update pickup status')),
        );
      }
    }
  }

  // ── Update profile photo ─────────────────────────────────────────────────────

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
      final path = '${DateTime.now().millisecondsSinceEpoch}.$fileExt';

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
      ref.invalidate(driverProfileProvider(session.user.id));
    } catch (e) {
      debugPrint('Error updating photo: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e')),
        );
      }
    }
  }

  // ── Emergency call — hardcoded admin number + WhatsApp ───────────────────────

  Future<void> _emergencyCall() async {
    final callUri = Uri(scheme: 'tel', path: adminEmergencyNumber);
    if (await canLaunchUrl(callUri)) {
      await launchUrl(callUri);
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cannot place call')),
      );
    }
  }

  // ── Sign out ─────────────────────────────────────────────────────────────────

  Future<void> _signOut() async {
    await Supabase.instance.client.auth.signOut();
    if (mounted) context.go('/login');
  }

  // ── Profile ────────────────────────────────────────────────────────────────────

  void _toggleProfileEdit() {
    if (!_isEditingProfile && _userId != null) {
      final session = Supabase.instance.client.auth.currentSession;
      if (session != null) {
        ref.read(driverProfileProvider(session.user.id)).whenOrNull(
          data: (profile) {
            _nameCtrl.text = (profile?['full_name'] as String?) ?? '';
            _phoneCtrl.text = (profile?['phone'] as String?) ?? '';
            _emailCtrl.text = (profile?['email'] as String?) ?? '';
            _licenseCtrl.text = (profile?['license_number'] as String?) ?? '';
          },
        );
      }
    }
    setState(() => _isEditingProfile = !_isEditingProfile);
  }

  Future<void> _saveProfile() async {
    if (_userId == null) return;
    try {
      await Supabase.instance.client.from('profiles').update({
        'full_name': _nameCtrl.text.trim(),
        'phone': _phoneCtrl.text.trim(),
        'email': _emailCtrl.text.trim(),
        'license_number': _licenseCtrl.text.trim(),
      }).eq('id', _userId!);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated')),
        );
      }
      ref.invalidate(driverProfileProvider(_userId!));
      setState(() => _isEditingProfile = false);
    } catch (e) {
      debugPrint('Error saving profile: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving: $e')),
        );
      }
    }
  }

  void _cancelEdit() {
    _nameCtrl.clear();
    _phoneCtrl.clear();
    _emailCtrl.clear();
    _licenseCtrl.clear();
    setState(() => _isEditingProfile = false);
  }

  // ── Dispose ────────────────────────────────────────────────────────────────────

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _licenseCtrl.dispose();
    super.dispose();
  }

  // ── Profile section builder ────────────────────────────────────────────────────

  Widget _buildProfileSection() {
    final uid = _userId;
    if (uid == null) return const SizedBox.shrink();

    final profile = (ref.watch(driverProfileProvider(uid)).valueOrNull ??
        _driverProfile ??
        <String, dynamic>{}) as Map<String, dynamic>;

    if (_isEditingProfile) {
      return GlassCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Edit Profile',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _nameCtrl,
              decoration: const InputDecoration(
                labelText: 'Name',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.person_outlined),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _phoneCtrl,
              decoration: const InputDecoration(
                labelText: 'Phone',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.phone_outlined),
              ),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _emailCtrl,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.email_outlined),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _licenseCtrl,
              decoration: const InputDecoration(
                labelText: 'License Number',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.badge_outlined),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                FilledButton(
                  onPressed: _saveProfile,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: AppColors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 28, vertical: 14),
                  ),
                  child: const Text(
                    'Save Changes',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                TextButton(
                  onPressed: _cancelEdit,
                  child: const Text(
                    'Cancel',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      );
    }

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Profile',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              TextButton(
                onPressed: _toggleProfileEdit,
                child: const Text(
                  'Edit',
                  style: TextStyle(
                    color: AppColors.primaryBlue,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          _buildProfileRow('Name', (profile['full_name'] as String?) ?? '—'),
          _buildProfileRow('Phone', profile['phone'] as String? ?? '—'),
          _buildProfileRow('Email', profile['email'] as String? ?? '—'),
          _buildProfileRow('License Number', profile['license_number'] as String? ?? '—'),
        ],
      ),
    );
  }

  Widget _buildProfileRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
              overflow: TextOverflow.ellipsis,
              maxLines: 2,
            ),
          ),
        ],
      ),
    );
  }

  // ── Helper: format shift / route time ─────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final uid = _userId;
    if (uid == null) {
      return const Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image(image: AssetImage('assets/images/logo.png'), width: 80, height: 80),
              SizedBox(height: 16),
              Text('Not authenticated', style: TextStyle(fontSize: 16)),
            ],
          ),
        ),
      );
    }

    final profileAsync = ref.watch(driverProfileProvider(uid));
    final routeAsync = ref.watch(activeRouteProvider(uid));
    final childrenAsync = routeAsync.value != null
        ? ref.watch(routeChildrenProvider(routeAsync.value!['id'] as String))
        : const AsyncValue.data([]);

    if (_isCheckingRole) {
      return Scaffold(
        body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [AppColors.primaryBlue, AppColors.primaryCoral],
            ),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Image(
                  image: AssetImage('assets/images/logo.png'),
                  width: 100,
                  height: 100,
                ),
                const SizedBox(height: 24),
                const CircularProgressIndicator(color: AppColors.white, strokeWidth: 3),
                const SizedBox(height: 16),
                Text(
                  'Verifying driver access...',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.white),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final profile = profileAsync.value ?? _driverProfile ?? {'full_name': 'Driver'};
    final route = routeAsync.value;
    final children = childrenAsync.value ?? [];

    // ── Derive route name + shift time ─────────────────────────────────────────
    final routeName = route?['name'] ?? 'Unassigned';
    final shiftLabel = _formatShiftTime(route?['pickup_time'], route?['return_time']);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // ── App Bar ────────────────────────────────────────────────────────────
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
                tooltip: 'Profile',
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
                  // Route name
                  Row(
                    children: [
                      const Icon(
                        Icons.directions_bus_rounded,
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
                  // Shift time
                  Text(
                    shiftLabel,
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
                // ── Driver avatar (tap = change photo) ───────────────────────────
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
                                Icons.person_rounded,
                                color: Colors.white,
                                size: 24,
                              ),
                            )
                          : const Icon(
                              Icons.person_rounded,
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
                        color: Colors.white,
                      ),
                    ),
                    if (profile['phone'] != null &&
                        (profile['phone'] as String).isNotEmpty)
                      Text(
                        profile['phone'] as String,
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

          // ── Body ───────────────────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Profile section ────────────────────────────────────────────
                  _buildProfileSection(),
                  const SizedBox(height: 16),

                  // ── Start / End Route ──────────────────────────────────────────
                  GlassCard(
                    child: Container(
                      width: double.infinity,
                      height: 72,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: _routeActive
                              ? [AppColors.errorRed, const Color(0xFFDC2626)]
                              : [AppColors.primaryBlue, AppColors.primaryCoral],
                        ),
                        borderRadius: BorderRadius.circular(22),
                        boxShadow: [
                          BoxShadow(
                            color: (_routeActive
                                    ? AppColors.errorRed
                                    : AppColors.primaryCoral)
                                .withValues(alpha: 0.45),
                            blurRadius: 22,
                            offset: const Offset(0, 12),
                          ),
                        ],
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(22),
                          onTap: _isStartingRoute ? null : _toggleRoute,
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
                                  letterSpacing: 0.5,
                                ),
                              ),
                              if (_isStartingRoute) ...[
                                const SizedBox(width: 12),
                                const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.5,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // ── Children header ─────────────────────────────────────────────
                  Text(
                    'Children (${children.where((c) => c['picked'] == true).length}/${children.length})',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // ── Children list ────────────────────────────────────────────────
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
                          CircularProgressIndicator(color: AppColors.primaryBlue),
                        ],
                      ),
                    ))
                  else if (children.isEmpty)
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
                              style: TextStyle(fontSize: 15, color: AppColors.textSecondary),
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
                                // ── Child avatar ───────────────────────────────────────
                                Container(
                                  width: 50,
                                  height: 50,
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.orange.shade400,
                                        Colors.red.shade400,
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: child['photo_url'] != null &&
                                          (child['photo_url'] as String).isNotEmpty
                                      ? ClipRRect(
                                          borderRadius: BorderRadius.circular(12),
                                          child: Image.network(
                                            child['photo_url'],
                                            fit: BoxFit.cover,
                                            errorBuilder: (_, __, ___) => const Icon(
                                              Icons.child_care_rounded,
                                              color: Colors.white,
                                              size: 24,
                                            ),
                                          ),
                                        )
                                      : const Icon(
                                          Icons.child_care_rounded,
                                          color: Colors.white,
                                          size: 24,
                                        ),
                                ),
                                const SizedBox(width: 16),
                                // ── Name + pickup location ──────────────────────────────
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        child['full_name'] ?? 'Child',
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                          color: AppColors.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          const Icon(
                                            Icons.location_on_rounded,
                                            size: 13,
                                            color: AppColors.textSecondary,
                                          ),
                                          const SizedBox(width: 3),
                                          Expanded(
                                            child: Text(
                                              child['parent_name']?.isNotEmpty == true
                                                  ? 'Pickup: ${child['parent_name']}'
                                                  : 'Pickup: On route',
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: AppColors.textSecondary,
                                              ),
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                // ── Picked / Not picked toggle ──────────────────────────
                                Column(
                                  children: [
                                    Text(
                                      child['picked'] == true ? 'Picked' : 'Not picked',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w500,
                                        color: child['picked'] == true
                                            ? AppColors.accentGreen
                                            : AppColors.textSecondary,
                                      ),
                                    ),
                                    Switch(
                                      value: child['picked'] == true,
                                      onChanged: (value) {
                                        setState(
                                            () => child['picked'] = value);
                                        _onPickedChanged(child, value);
                                      },
                                      activeThumbColor: AppColors.primaryBlue,
                                      activeTrackColor:
                                          AppColors.primaryBlue.withValues(alpha: 0.3),
                                    ),
                                  ],
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

      // ── Emergency Call bottom bar ──────────────────────────────────────────────
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: GlassCard(
          child: Row(
            children: [
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
    );
  }

  // ── Helper: format shift / route time ────────────────────────────────────────

  String _formatShiftTime(String? pickup, String? returnTime) {
    if (pickup == null || pickup.isEmpty) return 'Shift time —';
    // If it's already a time string like "08:00:00"
    if (pickup.length >= 5) {
      final t = pickup.length >= 8 ? pickup.substring(0, 5) : pickup;
      if (returnTime != null && returnTime.length >= 5) {
        final r = returnTime.length >= 8 ? returnTime.substring(0, 5) : returnTime;
        return 'Shift: $t – $r';
      }
      return 'Pickup: $t';
    }
    return 'Shift: —';
  }
}
