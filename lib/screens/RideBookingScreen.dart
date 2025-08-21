
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'address_input_screen.dart';
import 'notifications.dart';
import 'profile.dart';
import 'ride_history.dart';
import 'phone_register_screen.dart';
import '../theme/app_theme.dart';
import '../main.dart'; // import NyatApp for global dark mode

class RideBookingScreen extends StatefulWidget {
  const RideBookingScreen({Key? key}) : super(key: key);

  @override
  State<RideBookingScreen> createState() => _RideBookingScreenState();
}

class _RideBookingScreenState extends State<RideBookingScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late MapController _mapController;

  LatLng? _currentLocation;
  LatLng? _pickupPoint;
  LatLng? _dropoffPoint;

  String? _pickupName;
  String? _dropoffName;
  String _selectedRideType = "Standard";

  List<LatLng> _routePolyline = [];
  double? _routeDistanceKm;
  double? _routeDurationMin;

  final List<Map<String, String>> rideTypes = [
    {"type": "Vitz", "price": "100 ETB"},
    {"type": "Hyundai", "price": "115 ETB"},
    {"type": "Taxi", "price": "158 ETB"},
  ];

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
    _requestLocation();
  }

  Future<void> _requestLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enable location services.')),
      );
      return;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return;
    }

    if (permission == LocationPermission.deniedForever) return;

    Position position = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );

    setState(() {
      _currentLocation = LatLng(position.latitude, position.longitude);
    });

    _mapController.move(_currentLocation!, 15);
  }

  Future<void> _drawRoute() async {
    if (_pickupPoint == null || _dropoffPoint == null) return;

    final url =
        "https://router.project-osrm.org/route/v1/driving/${_pickupPoint!.longitude},${_pickupPoint!.latitude};${_dropoffPoint!.longitude},${_dropoffPoint!.latitude}?overview=full&geometries=geojson";

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final route = data['routes'][0]['geometry']['coordinates'] as List;

      List<LatLng> polylinePoints =
          route
              .map((point) => LatLng(point[1] as double, point[0] as double))
              .toList();

      setState(() {
        _routePolyline = polylinePoints;
        _routeDistanceKm = (data['routes'][0]['distance'] as num) / 1000;
        _routeDurationMin = (data['routes'][0]['duration'] as num) / 60;
      });

      _mapController.fitBounds(
        LatLngBounds.fromPoints(polylinePoints),
        options: const FitBoundsOptions(padding: EdgeInsets.all(50)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: NyatApp.isDarkMode,
      builder: (_, darkMode, __) {
        final theme = darkMode ? ThemeData.dark() : AppTheme.light();
        final primaryColor = theme.colorScheme.primary;

        return Scaffold(
          key: _scaffoldKey,
          drawer: _buildDrawer(primaryColor, darkMode),
          appBar: AppBar(
            title: const Text("Ride Booking Ethiopia"),
            centerTitle: true,
            backgroundColor: primaryColor,
            leading: IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () => _scaffoldKey.currentState?.openDrawer(),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.notifications),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => NotificationsScreen()),
                  );
                },
              ),
            ],
          ),
          body: Stack(
            children: [
              _buildMap(primaryColor),
              _buildBottomPanel(primaryColor, darkMode),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMap(Color primaryColor) {
    return Stack(
      children: [
        FlutterMap(
          mapController: _mapController,
          options: MapOptions(
            center: _currentLocation ?? LatLng(9.03, 38.74),
            zoom: 13,
          ),
          children: [
            TileLayer(
              urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              subdomains: const ['a', 'b', 'c'],
            ),
            MarkerLayer(
              markers: [
                if (_currentLocation != null)
                  Marker(
                    point: _currentLocation!,
                    builder:
                        (ctx) => const Icon(
                          Icons.my_location,
                          color: Colors.blue,
                          size: 40,
                        ),
                  ),
                if (_pickupPoint != null)
                  Marker(
                    point: _pickupPoint!,
                    builder:
                        (ctx) => const Icon(
                          Icons.location_on,
                          color: Colors.green,
                          size: 40,
                        ),
                  ),
                if (_dropoffPoint != null)
                  Marker(
                    point: _dropoffPoint!,
                    builder:
                        (ctx) => const Icon(
                          Icons.location_on,
                          color: Colors.red,
                          size: 40,
                        ),
                  ),
              ],
            ),
            if (_routePolyline.isNotEmpty)
              PolylineLayer(
                polylines: [
                  Polyline(
                    points: _routePolyline,
                    color: primaryColor,
                    strokeWidth: 4,
                  ),
                ],
              ),
          ],
        ),
        if (_routeDistanceKm != null && _routeDurationMin != null)
          Positioned(
            top: 10,
            left: 20,
            right: 20,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.9),
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 8,
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Distance: ${_routeDistanceKm!.toStringAsFixed(2)} km",
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(
                    "Time: ${_routeDurationMin!.round()} min",
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildBottomPanel(Color primaryColor, bool darkMode) {
    final isActive =
        _pickupName != null &&
        _dropoffName != null &&
        _selectedRideType.isNotEmpty;

    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: SafeArea(
        child: Container(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
          decoration: BoxDecoration(
            color: darkMode ? Colors.grey[900] : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 16),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildLocationRow("Pickup", _pickupName, true, primaryColor),
              const SizedBox(height: 10),
              _buildLocationRow("Dropoff", _dropoffName, false, primaryColor),
              const SizedBox(height: 20),
              _buildRideTypeSelector(primaryColor),
              const SizedBox(height: 24),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: isActive ? primaryColor : Colors.grey,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed:
                    isActive
                        ? () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                "Ordered $_selectedRideType from $_pickupName to $_dropoffName",
                              ),
                            ),
                          );
                        }
                        : null,
                child: const Text(
                  "Order Ride",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLocationRow(
    String label,
    String? location,
    bool isPickup,
    Color primaryColor,
  ) {
    return InkWell(
      onTap: () async {
        final result = await Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => AddressInputScreen(places: {})),
        );
        if (result != null) {
          setState(() {
            if (isPickup) {
              _pickupName = result['name'];
              _pickupPoint = result['latLng'];
            } else {
              _dropoffName = result['name'];
              _dropoffPoint = result['latLng'];
            }
          });
          await _drawRoute();
        }
      },
      child: Row(
        children: [
          Icon(
            isPickup ? Icons.my_location : Icons.location_on,
            color: primaryColor,
            size: 28,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
                Text(
                  location ?? "Tap to select",
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.edit, size: 22, color: Colors.grey),
        ],
      ),
    );
  }

  Widget _buildRideTypeSelector(Color primaryColor) {
    return SizedBox(
      height: 110,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: rideTypes.length,
        itemBuilder: (context, index) {
          final ride = rideTypes[index];
          final isSelected = ride['type'] == _selectedRideType;
          return GestureDetector(
            onTap: () => setState(() => _selectedRideType = ride['type']!),
            child: Container(
              width: 140,
              margin: const EdgeInsets.only(right: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color:
                    isSelected
                        ? primaryColor.withOpacity(0.15)
                        : Colors.grey.shade100,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isSelected ? primaryColor : Colors.grey.shade300,
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    ride['type']!,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: isSelected ? primaryColor : Colors.black87,
                      fontSize: 16,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    ride['price']!,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: isSelected ? primaryColor : Colors.black87,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildDrawer(Color primaryColor, bool darkMode) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: primaryColor),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                CircleAvatar(radius: 30, child: Icon(Icons.person, size: 40)),
                SizedBox(height: 16),
                Text(
                  "Welcome, User",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          _buildDrawerItem(Icons.history, "Ride History", () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const RideHistoryScreen()),
            );
          }, primaryColor),
          _buildDrawerItem(Icons.notifications, "Notifications", () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => NotificationsScreen()),
            );
          }, primaryColor),
          _buildDrawerItem(Icons.person, "Profile", () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ProfilePage()),
            );
          }, primaryColor),
          const Divider(),
          SwitchListTile(
            title: const Text("Dark Mode"),
            value: NyatApp.isDarkMode.value,
            onChanged: (v) => NyatApp.isDarkMode.value = v,
            secondary: const Icon(Icons.brightness_6),
          ),
          _buildDrawerItem(Icons.logout, "Logout", () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => const PhoneRegisterScreen()),
            );
          }, primaryColor),
        ],
      ),
    );
  }

  ListTile _buildDrawerItem(
    IconData icon,
    String title,
    VoidCallback onTap,
    Color primaryColor,
  ) {
    return ListTile(
      leading: Icon(icon, color: primaryColor),
      title: Text(title),
      onTap: onTap,
    );
  }
}
