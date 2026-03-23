import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../main.dart';

class LiveRouteScreen extends StatefulWidget {
  const LiveRouteScreen({super.key});

  @override
  State<LiveRouteScreen> createState() => _LiveRouteScreenState();
}

class _LiveRouteScreenState extends State<LiveRouteScreen> {
  final Completer<GoogleMapController> _controller = Completer();
  static const CameraPosition _kGooglePlex = CameraPosition(
    target: LatLng(37.42796133580664, -122.085749655962),
    zoom: 14.4746,
  );

  Timer? _timer;
  int onboardCount = 5;
  String currentStop = 'Oak Street';
  String nextStop = 'Pine Street';
  String eta = '5 min';

  @override
  void initState() {
    super.initState();
    _startLocationUpdates();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startLocationUpdates() {
    _timer = Timer.periodic(const Duration(seconds: 15), (timer) {
      setState(() {
        // Simulate updates
        onboardCount = (onboardCount + 1) % 10;
        final stops = ['Oak Street', 'Pine Street', 'Birch Road', 'School'];
        final index = stops.indexOf(currentStop);
        if (index < stops.length - 1) {
          currentStop = stops[index + 1];
          nextStop = stops[(index + 2) % stops.length];
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          GoogleMap(
            mapType: MapType.normal,
            initialCameraPosition: _kGooglePlex,
            onMapCreated: (GoogleMapController controller) {
              _controller.complete(controller);
            },
            polylines: {
              Polyline(
                polylineId: const PolylineId('route'),
                points: [
                  const LatLng(37.42796133580664, -122.085749655962),
                  const LatLng(37.432962, -122.088323),
                  const LatLng(37.438963, -122.091323),
                  const LatLng(37.444964, -122.094323),
                ],
                color: AppColors.blueGradientEnd,
                width: 5,
              ),
            },
            markers: {
              Marker(
                markerId: const MarkerId('school'),
                position: const LatLng(37.444964, -122.094323),
                icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
                infoWindow: const InfoWindow(title: 'ChildTrack School'),
              ),
              Marker(
                markerId: const MarkerId('student1'),
                position: const LatLng(37.4300, -122.0860),
                icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
                infoWindow: const InfoWindow(title: 'Emma J.'),
              ),
              Marker(
                markerId: const MarkerId('student2'),
                position: const LatLng(37.4350, -122.0890),
                icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
                infoWindow: const InfoWindow(title: 'Noah W.'),
              ),
            },
          ),
          // Bottom floating card
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
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(colors: [Colors.orange.shade400, Colors.red.shade400]),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.location_pin, color: Colors.white, size: 20),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(child: Text('Current Stop', style: TextStyle(fontWeight: FontWeight.w600))),
                      ],
                    ),
                    Text(currentStop, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(colors: [AppColors.blueGradientStart, AppColors.blueGradientEnd]),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.arrow_forward, color: Colors.white, size: 20),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(child: Text('Next Stop', style: TextStyle(fontWeight: FontWeight.w600))),
                      ],
                    ),
                    Text(nextStop, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.access_time, size: 20),
                            const SizedBox(width: 8),
                            Text('ETA: $eta'),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.green.shade400,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text('$onboardCount kids', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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
