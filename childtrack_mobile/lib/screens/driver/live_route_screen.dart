import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../main.dart' show AppColors, GlassCard;

// ────────────────────────────────────────────────────────────────────────────────
// RIVERPOD PROVIDERS  (matching driver_home_screen.dart pattern)
// ────────────────────────────────────────────────────────────────────────────────

/// Active route for the current driver
final _liveActiveRouteProvider =
    FutureProvider.autoDispose<Map<String, dynamic>?>((ref) async {
  final session = Supabase.instance.client.auth.currentSession;
  if (session == null) return null;
  try {
    final res = await Supabase.instance.client
        .from('transport_routes')
        .select('id, name, driver_id, vehicle, status')
        .eq('driver_id', session.user.id)
        .eq('status', 'ACTIVE')
        .order('created_at', ascending: false)
        .limit(1);
    final list = res as List?;
    if (list == null || list.isEmpty) return null;
    return Map<String, dynamic>.from(list.first);
  } catch (e) {
    debugPrint('Error fetching live route: $e');
    return null;
  }
});

/// Children on the active route + their parent + transport status
final _liveRouteChildrenProvider =
    FutureProvider.autoDispose<List<Map<String, dynamic>>>((ref) async {
  final routeAsync = ref.watch(_liveActiveRouteProvider);
  final route = routeAsync.value;
  if (route == null) return [];
  final routeId = route['id'] as String;

  try {
    // child_transport links children to this route
    final links = await Supabase.instance.client
        .from('child_transport')
        .select('child_id, status, pickup_time, dropoff_time')
        .eq('route_id', routeId);

    final linkList = links as List? ?? [];
    final childIds = linkList
        .map((r) => r['child_id'] as String?)
        .whereType<String>()
        .toList();

    if (childIds.isEmpty) return [];

    // Fetch children record (includes pickup_location as "lat,lng" text)
    final childrenRes = await Supabase.instance.client
        .from('children')
        .select('id, full_name, photo_url, parent_id, pickup_location')
        .inFilter('id', childIds);

    final children = List<Map<String, dynamic>>.from(childrenRes);

    // Fetch parent profiles in a single batch
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

    // Merge: children + parent info + transport status
    final transportMap = <String, Map<String, dynamic>>{};
    for (var link in linkList) {
      transportMap[link['child_id'] as String] =
          Map<String, dynamic>.from(link);
    }

    return children.map((child) {
      final pid = child['parent_id'] as String?;
      final transport = transportMap[child['id'] as String];
      return {
        ...child,
        'parent_name': pid != null && parentMap.containsKey(pid)
            ? parentMap[pid]!['full_name'] ?? ''
            : '',
        'parent_phone': pid != null && parentMap.containsKey(pid)
            ? parentMap[pid]!['phone'] ?? ''
            : '',
        'transport_status': transport?['status'] ?? 'NOT_PICKED',
        'pickup_time': transport?['pickup_time'],
        'dropoff_time': transport?['dropoff_time'],
      };
    }).toList();
  } catch (e) {
    debugPrint('Error fetching live route children: $e');
    return [];
  }
});

// ────────────────────────────────────────────────────────────────────────────────
// LIVE ROUTE SCREEN
// ────────────────────────────────────────────────────────────────────────────────

class LiveRouteScreen extends ConsumerStatefulWidget {
  const LiveRouteScreen({super.key});

  @override
  ConsumerState<LiveRouteScreen> createState() => _LiveRouteScreenState();
}

class _LiveRouteScreenState extends ConsumerState<LiveRouteScreen> {
  Set<Marker> _markers = {};
  Set<Polyline> _polylines = {};

  @override
  void initState() {
    super.initState();
    _refreshMarkers();
  }

  void _refreshMarkers() {
    final children = ref.read(_liveRouteChildrenProvider).value ?? [];

    if (children.isEmpty) {
      setState(() {
        _markers = {};
        _polylines = {};
      });
      return;
    }

    final markers = <Marker>{};
    final polylinePoints = <LatLng>[];

    for (var i = 0; i < children.length; i++) {
      final child = children[i];
      final coords = _parseLatLng(
        child['pickup_location'] as String?,
      );
      if (coords == null) continue;

      final name = (child['full_name'] as String?) ?? 'Child';
      final status = child['transport_status'] as String? ?? 'NOT_PICKED';
      final schoolColor = status == 'ONBOARD'
          ? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen)
          : BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange);

      markers.add(
        Marker(
          markerId: MarkerId('child_$i'),
          position: coords,
          icon: schoolColor,
          infoWindow: InfoWindow(
            title: name,
            snippet: 'Pickup: ${child['parent_name'] ?? 'Unknown'}  |  $status',
          ),
        ),
      );

      polylinePoints.add(coords);
    }

    setState(() {
      _markers = markers;
      _polylines = polylinePoints.isNotEmpty
          ? {
              Polyline(
                polylineId: const PolylineId('route'),
                points: polylinePoints,
                color: AppColors.primaryBlue,
                width: 5,
              ),
            }
          : {};
    });
  }

  /// Parses a "lat,lng" text string from children.pickup_location.
  /// Returns null if the location is missing or unparseable.
  LatLng? _parseLatLng(String? location) {
    if (location == null || location.isEmpty) return null;
    final parts = location.split(',');
    if (parts.length != 2) return null;
    final lat = double.tryParse(parts[0].trim());
    final lng = double.tryParse(parts[1].trim());
    if (lat == null || lng == null) return null;
    return LatLng(lat, lng);
  }

  /// Derives an ETA string from the route's name (e.g. "Morning Route A → 15 min")
  String _deriveEta() {
    final route = ref.read(_liveActiveRouteProvider).value;
    final name = route?['name'] as String? ?? 'Route';
    return '→ $name';
  }

  @override
  Widget build(BuildContext context) {
    final routeAsync = ref.watch(_liveActiveRouteProvider);
    final childrenAsync = ref.watch(_liveRouteChildrenProvider);

    // ── Not authenticated ────────────────────────────────────────────────────
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) {
      return Scaffold(
        body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [AppColors.primaryBlue, AppColors.primaryCoral],
            ),
          ),
          child: const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image(
                  image: AssetImage('assets/images/logo.png'),
                  width: 80,
                  height: 80,
                ),
                SizedBox(height: 16),
                Text(
                  'Not authenticated',
                  style: TextStyle(fontSize: 16, color: AppColors.white),
                ),
              ],
            ),
          ),
        ),
      );
    }

    // ── No active route ──────────────────────────────────────────────────────
    if (!routeAsync.isLoading && routeAsync.value == null) {
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
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Image(
                    image: AssetImage('assets/images/logo.png'),
                    width: 80,
                    height: 80,
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'No active route',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppColors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Start your route from the home screen first.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 15,
                              color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    // ── Children loaded → recalculate markers ─────────────────────────────────
    if (!childrenAsync.isRefreshing && childrenAsync.value != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _refreshMarkers());
    }

    // ── Map data ─────────────────────────────────────────────────────────────
    final children = childrenAsync.value ?? [];
    final onboardCount = children
        .where((c) => (c['transport_status'] as String?) == 'ONBOARD')
        .length;
    final routeName = routeAsync.value?['name'] as String? ?? 'Route';
    final vehicle = routeAsync.value?['vehicle'] as String? ?? '';

    // Derive stop info from children list (ordered by pickup location coords)
    final currentStop = children.isNotEmpty
        ? (children.first['full_name'] as String?)
        : null;
    final nextStop = children.length > 1
        ? (children[1]['full_name'] as String?)
        : null;

    return Scaffold(
      body: Stack(
        children: [
          // ── Google Map ──────────────────────────────────────────────────────
          GoogleMap(
            initialCameraPosition: const CameraPosition(
              target: LatLng(-26.1076, 28.0590),
              zoom: 14,
            ),
            onMapCreated: (_) {},
            polylines: _polylines,
            markers: _markers,
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
          ),

          // ── Loading overlay ─────────────────────────────────────────────────
          if (routeAsync.isLoading || childrenAsync.isLoading)
            Container(
              color: Colors.black26,
              child: const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Image(
                      image: AssetImage('assets/images/logo.png'),
                      width: 80,
                      height: 80,
                    ),
                    SizedBox(height: 16),
                    CircularProgressIndicator(
                      color: AppColors.white,
                      strokeWidth: 3,
                    ),
                  ],
                ),
              ),
            ),

          // ── Bottom info card ────────────────────────────────────────────────
          Positioned(
            bottom: 100,
            left: 20,
            right: 20,
            child: GlassCard(
              glow: true,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Route name
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [AppColors.primaryBlue, AppColors.primaryCoral],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.directions_bus_rounded,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                routeName,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              if (vehicle.isNotEmpty)
                                Text(
                                  vehicle,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Current stop
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Colors.orange, AppColors.errorRed],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.location_pin,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Current Stop',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              Text(
                                currentStop ?? '—',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Next stop
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [AppColors.primaryBlue, AppColors.primaryCoral],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.arrow_forward,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Next Stop',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              Text(
                                nextStop ?? 'No further stops',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // ETA + onboarded badge
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.access_time,
                              size: 20,
                              color: AppColors.textSecondary,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _deriveEta(),
                              style: const TextStyle(
                                fontSize: 14,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primaryBlue,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '$onboardCount / ${children.length} onboard',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
