// import 'package:flutter/material.dart';
// import 'package:google_maps_flutter/google_maps_flutter.dart';
// import 'package:nyat_ride_system/screens/address_input_screen.dart';
// import 'package:nyat_ride_system/screens/notifications.dart';
// import 'package:nyat_ride_system/screens/profile.dart';
// import 'package:nyat_ride_system/screens/ride_history.dart';
// import 'package:nyat_ride_system/screens/phone_register_screen.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';
// import 'package:flutter_polyline_points/flutter_polyline_points.dart';

// class RideBookingScreen extends StatefulWidget {
//   const RideBookingScreen({Key? key}) : super(key: key);

//   @override
//   State<RideBookingScreen> createState() => _RideBookingScreenState();
// }

// class _RideBookingScreenState extends State<RideBookingScreen> {
//   final Color primaryColor = const Color(0xFF2E3192);
//   final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

//   late GoogleMapController _mapController;
//   LatLng _mapCenter = LatLng(9.03, 38.74);

//   String? _pickupName;
//   LatLng? _pickupPoint;

//   String? _dropoffName;
//   LatLng? _dropoffPoint;

//   String _selectedRideType = "Standard";

//   double? _distance;
//   String? _duration;

//   final List<Map<String, String>> rideTypes = [
//     {"type": "Standard", "time": "9-11 min", "price": "8.0-9.6"},
//     {"type": "Premium", "time": "7-9 min", "price": "10.5-12.0"},
//     {"type": "XL", "time": "10-12 min", "price": "12.0-14.0"},
//   ];

//   Set<Marker> _markers = {};
//   Set<Polyline> _polylines = {};
//   List<LatLng> _polylineCoordinates = [];
//   PolylinePoints polylinePoints = PolylinePoints();

//   String googleAPIKey =
//       "AIzaSyBQY3mzbE_A_NZ-215G_vgZ3bJKCGD5Dlg"; // Replace with your key

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       key: _scaffoldKey,
//       drawer: _buildDrawer(),
//       appBar: _buildAppBar(),
//       body: Stack(children: [_buildMap(), _buildBottomPanel()]),
//     );
//   }

//   AppBar _buildAppBar() {
//     return AppBar(
//       backgroundColor: primaryColor,
//       title: const Text("Ride Booking Ethiopia"),
//       centerTitle: true,
//       leading: IconButton(
//         icon: const Icon(Icons.menu),
//         onPressed: () => _scaffoldKey.currentState?.openDrawer(),
//       ),
//       actions: [
//         IconButton(
//           icon: const Icon(Icons.notifications),
//           onPressed: () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => NotificationsScreen()),
//             );
//           },
//         ),
//       ],
//     );
//   }

//   Widget _buildMap() {
//     return GoogleMap(
//       initialCameraPosition: CameraPosition(target: _mapCenter, zoom: 13),
//       markers: _markers,
//       polylines: _polylines,
//       myLocationEnabled: true,
//       onMapCreated: (controller) {
//         _mapController = controller;
//       },
//     );
//   }

//   Widget _buildBottomPanel() {
//     return Positioned(
//       bottom: 0,
//       left: 0,
//       right: 0,
//       child: SafeArea(
//         child: Container(
//           padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
//           decoration: BoxDecoration(
//             color: Colors.white,
//             borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
//             boxShadow: [
//               BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 16),
//             ],
//           ),
//           child: Column(
//             mainAxisSize: MainAxisSize.min,
//             children: [
//               _buildLocationRow("Pickup", _pickupName, Icons.my_location, true),
//               const SizedBox(height: 10),
//               _buildLocationRow(
//                 "Dropoff",
//                 _dropoffName,
//                 Icons.location_on,
//                 false,
//               ),
//               const SizedBox(height: 10),
//               if (_distance != null && _duration != null)
//                 Text(
//                   "Distance: ${_distance!.toStringAsFixed(1)} km | ETA: $_duration",
//                 ),
//               const SizedBox(height: 20),
//               _buildRideTypeSelector(),
//               const SizedBox(height: 24),
//               _buildOrderButton(),
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildLocationRow(
//     String label,
//     String? location,
//     IconData icon,
//     bool isPickup,
//   ) {
//     return InkWell(
//       onTap: () async {
//         // Implement your AddressInputScreen or Google Places autocomplete here
//         Map<String, dynamic>? result = await Navigator.push(
//           context,
//           MaterialPageRoute(
//             builder: (_) => AddressInputScreen(places: {}),
//           ), // create this screen
//         );

//         if (result != null) {
//           setState(() {
//             if (isPickup) {
//               _pickupName = result['name'];
//               _pickupPoint = result['latLng'];
//               _markers.add(
//                 Marker(
//                   markerId: const MarkerId('pickup'),
//                   position: _pickupPoint!,
//                   icon: BitmapDescriptor.defaultMarkerWithHue(
//                     BitmapDescriptor.hueGreen,
//                   ),
//                 ),
//               );
//             } else {
//               _dropoffName = result['name'];
//               _dropoffPoint = result['latLng'];
//               _markers.add(
//                 Marker(
//                   markerId: const MarkerId('dropoff'),
//                   position: _dropoffPoint!,
//                   icon: BitmapDescriptor.defaultMarkerWithHue(
//                     BitmapDescriptor.hueRed,
//                   ),
//                 ),
//               );
//             }

//             if (_pickupPoint != null && _dropoffPoint != null) _drawRoute();
//           });
//         }
//       },
//       child: Row(
//         children: [
//           Icon(icon, color: primaryColor, size: 28),
//           const SizedBox(width: 16),
//           Expanded(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   label,
//                   style: const TextStyle(fontSize: 12, color: Colors.grey),
//                 ),
//                 Text(
//                   location ?? "Tap to select",
//                   style: const TextStyle(
//                     fontSize: 16,
//                     fontWeight: FontWeight.w600,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//           const Icon(Icons.edit, size: 22, color: Colors.grey),
//         ],
//       ),
//     );
//   }

//   Widget _buildRideTypeSelector() {
//     return SizedBox(
//       height: 110,
//       child: ListView.builder(
//         scrollDirection: Axis.horizontal,
//         itemCount: rideTypes.length,
//         itemBuilder: (context, index) {
//           final ride = rideTypes[index];
//           final isSelected = ride['type'] == _selectedRideType;
//           return GestureDetector(
//             onTap: () => setState(() => _selectedRideType = ride['type']!),
//             child: Container(
//               width: 140,
//               margin: const EdgeInsets.only(right: 16),
//               padding: const EdgeInsets.all(16),
//               decoration: BoxDecoration(
//                 color:
//                     isSelected
//                         ? primaryColor.withOpacity(0.15)
//                         : Colors.grey.shade100,
//                 borderRadius: BorderRadius.circular(14),
//                 border: Border.all(
//                   color: isSelected ? primaryColor : Colors.grey.shade300,
//                   width: isSelected ? 2 : 1,
//                 ),
//               ),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     ride['type']!,
//                     style: TextStyle(
//                       fontWeight: FontWeight.bold,
//                       color: isSelected ? primaryColor : Colors.black87,
//                       fontSize: 16,
//                     ),
//                   ),
//                   const Spacer(),
//                   Text(
//                     "ETB ${ride['price']}",
//                     style: TextStyle(
//                       fontWeight: FontWeight.bold,
//                       color: isSelected ? primaryColor : Colors.black87,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           );
//         },
//       ),
//     );
//   }

//   Widget _buildOrderButton() {
//     return ElevatedButton(
//       style: ElevatedButton.styleFrom(
//         backgroundColor: primaryColor,
//         minimumSize: const Size(double.infinity, 50),
//       ),
//       onPressed:
//           (_pickupName != null && _dropoffName != null)
//               ? () => _showOrderConfirmation()
//               : null,
//       child: const Text(
//         "Order Ride",
//         style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//       ),
//     );
//   }

//   void _showOrderConfirmation() {
//     showDialog(
//       context: context,
//       builder:
//           (_) => AlertDialog(
//             title: const Text("Confirm Ride"),
//             content: Text(
//               "Ride Type: $_selectedRideType\nPickup: $_pickupName\nDropoff: $_dropoffName",
//             ),
//             actions: [
//               TextButton(
//                 onPressed: () => Navigator.pop(context),
//                 child: const Text("Cancel"),
//               ),
//               ElevatedButton(
//                 onPressed: () {
//                   Navigator.pop(context);
//                   ScaffoldMessenger.of(context).showSnackBar(
//                     SnackBar(
//                       content: Text(
//                         "Ordered $_selectedRideType from $_pickupName to $_dropoffName",
//                       ),
//                     ),
//                   );
//                 },
//                 style: ElevatedButton.styleFrom(backgroundColor: primaryColor),
//                 child: const Text("Confirm"),
//               ),
//             ],
//           ),
//     );
//   }

//   Future<void> _drawRoute() async {
//     if (_pickupPoint == null || _dropoffPoint == null) return;

//     final String url =
//         'https://maps.googleapis.com/maps/api/directions/json?origin=${_pickupPoint!.latitude},${_pickupPoint!.longitude}&destination=${_dropoffPoint!.latitude},${_dropoffPoint!.longitude}&key=$googleAPIKey';

//     final response = await http.get(Uri.parse(url));

//     if (response.statusCode == 200) {
//       final data = json.decode(response.body);

//       if ((data['routes'] as List).isNotEmpty) {
//         _polylineCoordinates.clear();
//         data['routes'][0]['legs'][0]['steps'].forEach((step) {
//           PolylinePoints().decodePolyline(step['polyline']['points']).forEach((
//             point,
//           ) {
//             _polylineCoordinates.add(LatLng(point.latitude, point.longitude));
//           });
//         });

//         setState(() {
//           _polylines.clear();
//           _polylines.add(
//             Polyline(
//               polylineId: const PolylineId('route'),
//               color: primaryColor,
//               width: 5,
//               points: _polylineCoordinates,
//             ),
//           );

//           // Set distance & duration
//           _distance =
//               data['routes'][0]['legs'][0]['distance']['value'] / 1000; // km
//           _duration = data['routes'][0]['legs'][0]['duration']['text'];
//         });

//         // Move camera
//         _mapController.animateCamera(
//           CameraUpdate.newLatLngBounds(
//             LatLngBounds(southwest: _pickupPoint!, northeast: _dropoffPoint!),
//             100,
//           ),
//         );
//       }
//     }
//   }

//   Widget _buildDrawer() {
//     return Drawer(
//       child: ListView(
//         padding: EdgeInsets.zero,
//         children: [
//           DrawerHeader(
//             decoration: BoxDecoration(color: primaryColor),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: const [
//                 CircleAvatar(radius: 30, child: Icon(Icons.person, size: 40)),
//                 SizedBox(height: 16),
//                 Text(
//                   "Welcome, User",
//                   style: TextStyle(
//                     color: Colors.white,
//                     fontSize: 18,
//                     fontWeight: FontWeight.bold,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//           _buildDrawerItem(Icons.history, "Ride History", () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => const RideHistoryScreen()),
//             );
//           }),
//           _buildDrawerItem(Icons.notifications, "Notifications", () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => NotificationsScreen()),
//             );
//           }),
//           _buildDrawerItem(Icons.person, "Profile", () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => const ProfilePage()),
//             );
//           }),
//           const Divider(),
//           _buildDrawerItem(Icons.logout, "Logout", () {
//             Navigator.pushReplacement(
//               context,
//               MaterialPageRoute(builder: (_) => const PhoneRegisterScreen()),
//             );
//           }),
//         ],
//       ),
//     );
//   }

//   ListTile _buildDrawerItem(IconData icon, String title, VoidCallback onTap) {
//     return ListTile(
//       leading: Icon(icon, color: primaryColor),
//       title: Text(title),
//       onTap: onTap,
//     );
//   }
// }

// import 'package:flutter/material.dart';
// import 'package:flutter_map/flutter_map.dart';
// import 'package:latlong2/latlong.dart';
// import 'package:geolocator/geolocator.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';

// import 'address_input_screen.dart';
// import 'notifications.dart';
// import 'profile.dart';
// import 'ride_history.dart';
// import 'phone_register_screen.dart';
// import '../theme/app_theme.dart';

// class RideBookingScreen extends StatefulWidget {
//   const RideBookingScreen({Key? key}) : super(key: key);

//   @override
//   State<RideBookingScreen> createState() => _RideBookingScreenState();
// }

// class _RideBookingScreenState extends State<RideBookingScreen> {
//   final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

//   late MapController _mapController;

//   LatLng? _currentLocation;
//   LatLng? _pickupPoint;
//   LatLng? _dropoffPoint;

//   String? _pickupName;
//   String? _dropoffName;
//   String _selectedRideType = "Standard";

//   List<LatLng> _routePolyline = [];

//   bool _darkMode = false;

//   final List<Map<String, String>> rideTypes = [
//     {"type": "Standard", "price": "8-10 ETB"},
//     {"type": "Premium", "price": "12-15 ETB"},
//     {"type": "XL", "price": "15-18 ETB"},
//   ];

//   @override
//   void initState() {
//     super.initState();
//     _mapController = MapController();
//     _requestLocation();
//   }

//   Future<void> _requestLocation() async {
//     bool serviceEnabled;
//     LocationPermission permission;

//     // Test if location services are enabled
//     serviceEnabled = await Geolocator.isLocationServiceEnabled();
//     if (!serviceEnabled) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text('Please enable location services.')),
//       );
//       return;
//     }

//     permission = await Geolocator.checkPermission();
//     if (permission == LocationPermission.denied) {
//       permission = await Geolocator.requestPermission();
//       if (permission == LocationPermission.denied) {
//         return;
//       }
//     }

//     if (permission == LocationPermission.deniedForever) {
//       return;
//     }

//     Position position = await Geolocator.getCurrentPosition(
//       desiredAccuracy: LocationAccuracy.high,
//     );

//     setState(() {
//       _currentLocation = LatLng(position.latitude, position.longitude);
//     });

//     // Move map to current location
//     _mapController.move(_currentLocation!, 15);
//   }

//   Future<void> _drawRoute() async {
//     if (_pickupPoint == null || _dropoffPoint == null) return;

//     final url =
//         "https://router.project-osrm.org/route/v1/driving/${_pickupPoint!.longitude},${_pickupPoint!.latitude};${_dropoffPoint!.longitude},${_dropoffPoint!.latitude}?overview=full&geometries=geojson";

//     final response = await http.get(Uri.parse(url));

//     if (response.statusCode == 200) {
//       final data = json.decode(response.body);
//       final route = data['routes'][0]['geometry']['coordinates'] as List;

//       List<LatLng> polylinePoints =
//           route
//               .map((point) => LatLng(point[1] as double, point[0] as double))
//               .toList();

//       setState(() {
//         _routePolyline = polylinePoints;
//       });

//       // Move map to show route
//       _mapController.fitBounds(
//         LatLngBounds.fromPoints(polylinePoints),
//         options: const FitBoundsOptions(padding: EdgeInsets.all(50)),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     final theme = AppTheme.light();

//     return MaterialApp(
//       theme: _darkMode ? ThemeData.dark() : theme,
//       home: Scaffold(
//         key: _scaffoldKey,
//         drawer: _buildDrawer(theme.primaryColor),
//         appBar: AppBar(
//           title: const Text("Ride Booking Ethiopia"),
//           centerTitle: true,
//           backgroundColor: theme.primaryColor,
//           leading: IconButton(
//             icon: const Icon(Icons.menu),
//             onPressed: () => _scaffoldKey.currentState?.openDrawer(),
//           ),
//           actions: [
//             IconButton(
//               icon: const Icon(Icons.notifications),
//               onPressed: () {
//                 Navigator.push(
//                   context,
//                   MaterialPageRoute(builder: (_) => NotificationsScreen()),
//                 );
//               },
//             ),
//           ],
//         ),
//         body: Stack(
//           children: [_buildMap(), _buildBottomPanel(theme.primaryColor)],
//         ),
//       ),
//     );
//   }

//   Widget _buildMap() {
//     return FlutterMap(
//       mapController: _mapController,
//       options: MapOptions(
//         center: _currentLocation ?? LatLng(9.03, 38.74),
//         zoom: 13,
//       ),
//       children: [
//         TileLayer(
//           urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//           subdomains: const ['a', 'b', 'c'],
//         ),
//         MarkerLayer(
//           markers: [
//             if (_currentLocation != null)
//               Marker(
//                 point: _currentLocation!,
//                 builder:
//                     (ctx) => const Icon(
//                       Icons.my_location,
//                       color: Colors.blue,
//                       size: 40,
//                     ),
//               ),
//             if (_pickupPoint != null)
//               Marker(
//                 point: _pickupPoint!,
//                 builder:
//                     (ctx) => const Icon(
//                       Icons.location_on,
//                       color: Colors.green,
//                       size: 40,
//                     ),
//               ),
//             if (_dropoffPoint != null)
//               Marker(
//                 point: _dropoffPoint!,
//                 builder:
//                     (ctx) => const Icon(
//                       Icons.location_on,
//                       color: Colors.red,
//                       size: 40,
//                     ),
//               ),
//           ],
//         ),
//         if (_routePolyline.isNotEmpty)
//           PolylineLayer(
//             polylines: [
//               Polyline(
//                 points: _routePolyline,
//                 color: Theme.of(context).primaryColor,
//                 strokeWidth: 4,
//               ),
//             ],
//           ),
//       ],
//     );
//   }

//   Widget _buildBottomPanel(Color primaryColor) {
//     return Positioned(
//       bottom: 0,
//       left: 0,
//       right: 0,
//       child: SafeArea(
//         child: Container(
//           padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
//           decoration: BoxDecoration(
//             color: _darkMode ? Colors.grey[900] : Colors.white,
//             borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
//             boxShadow: [
//               BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 16),
//             ],
//           ),
//           child: Column(
//             mainAxisSize: MainAxisSize.min,
//             children: [
//               _buildLocationRow("Pickup", _pickupName, true, primaryColor),
//               const SizedBox(height: 10),
//               _buildLocationRow("Dropoff", _dropoffName, false, primaryColor),
//               const SizedBox(height: 20),
//               _buildRideTypeSelector(primaryColor),
//               const SizedBox(height: 24),
//               _buildOrderButton(primaryColor),
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildLocationRow(
//     String label,
//     String? location,
//     bool isPickup,
//     Color primaryColor,
//   ) {
//     return InkWell(
//       onTap: () async {
//         final result = await Navigator.push(
//           context,
//           MaterialPageRoute(builder: (_) => AddressInputScreen(places: {})),
//         );
//         if (result != null) {
//           setState(() {
//             if (isPickup) {
//               _pickupName = result['name'];
//               _pickupPoint = result['latLng'];
//             } else {
//               _dropoffName = result['name'];
//               _dropoffPoint = result['latLng'];
//             }
//           });
//           await _drawRoute();
//         }
//       },
//       child: Row(
//         children: [
//           Icon(
//             isPickup ? Icons.my_location : Icons.location_on,
//             color: primaryColor,
//             size: 28,
//           ),
//           const SizedBox(width: 16),
//           Expanded(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   label,
//                   style: const TextStyle(fontSize: 12, color: Colors.grey),
//                 ),
//                 Text(
//                   location ?? "Tap to select",
//                   style: const TextStyle(
//                     fontSize: 16,
//                     fontWeight: FontWeight.w600,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//           const Icon(Icons.edit, size: 22, color: Colors.grey),
//         ],
//       ),
//     );
//   }

//   Widget _buildRideTypeSelector(Color primaryColor) {
//     return SizedBox(
//       height: 110,
//       child: ListView.builder(
//         scrollDirection: Axis.horizontal,
//         itemCount: rideTypes.length,
//         itemBuilder: (context, index) {
//           final ride = rideTypes[index];
//           final isSelected = ride['type'] == _selectedRideType;
//           return GestureDetector(
//             onTap: () => setState(() => _selectedRideType = ride['type']!),
//             child: Container(
//               width: 140,
//               margin: const EdgeInsets.only(right: 16),
//               padding: const EdgeInsets.all(16),
//               decoration: BoxDecoration(
//                 color:
//                     isSelected
//                         ? primaryColor.withOpacity(0.15)
//                         : Colors.grey.shade100,
//                 borderRadius: BorderRadius.circular(14),
//                 border: Border.all(
//                   color: isSelected ? primaryColor : Colors.grey.shade300,
//                   width: isSelected ? 2 : 1,
//                 ),
//               ),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     ride['type']!,
//                     style: TextStyle(
//                       fontWeight: FontWeight.bold,
//                       color: isSelected ? primaryColor : Colors.black87,
//                       fontSize: 16,
//                     ),
//                   ),
//                   const Spacer(),
//                   Text(
//                     ride['price']!,
//                     style: TextStyle(
//                       fontWeight: FontWeight.bold,
//                       color: isSelected ? primaryColor : Colors.black87,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           );
//         },
//       ),
//     );
//   }

//   Widget _buildOrderButton(Color primaryColor) {
//     return ElevatedButton(
//       style: ElevatedButton.styleFrom(
//         backgroundColor: primaryColor,
//         minimumSize: const Size(double.infinity, 50),
//       ),
//       onPressed:
//           (_pickupName != null && _dropoffName != null)
//               ? () {
//                 ScaffoldMessenger.of(context).showSnackBar(
//                   SnackBar(
//                     content: Text(
//                       "Ordered $_selectedRideType from $_pickupName to $_dropoffName",
//                     ),
//                   ),
//                 );
//               }
//               : null,
//       child: const Text(
//         "Order Ride",
//         style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//       ),
//     );
//   }

//   Widget _buildDrawer(Color primaryColor) {
//     return Drawer(
//       child: ListView(
//         padding: EdgeInsets.zero,
//         children: [
//           DrawerHeader(
//             decoration: BoxDecoration(color: primaryColor),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: const [
//                 CircleAvatar(radius: 30, child: Icon(Icons.person, size: 40)),
//                 SizedBox(height: 16),

//                 Text(
//                   "Welcome, User",
//                   style: TextStyle(
//                     color: Colors.white,
//                     fontSize: 18,
//                     fontWeight: FontWeight.bold,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//           _buildDrawerItem(Icons.history, "Ride History", () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => const RideHistoryScreen()),
//             );
//           }, primaryColor),
//           _buildDrawerItem(Icons.notifications, "Notifications", () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => NotificationsScreen()),
//             );
//           }, primaryColor),
//           _buildDrawerItem(Icons.person, "Profile", () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => const ProfilePage()),
//             );
//           }, primaryColor),
//           const Divider(),
//           SwitchListTile(
//             title: const Text("Dark Mode"),
//             value: _darkMode,
//             onChanged: (v) => setState(() => _darkMode = v),
//             secondary: const Icon(Icons.brightness_6),
//           ),
//           _buildDrawerItem(Icons.logout, "Logout", () {
//             Navigator.pushReplacement(
//               context,
//               MaterialPageRoute(builder: (_) => const PhoneRegisterScreen()),
//             );
//           }, primaryColor),
//         ],
//       ),
//     );
//   }

//   ListTile _buildDrawerItem(
//     IconData icon,
//     String title,
//     VoidCallback onTap,
//     Color primaryColor,
//   ) {
//     return ListTile(
//       leading: Icon(icon, color: primaryColor),
//       title: Text(title),
//       onTap: onTap,
//     );
//   }
// }

// import 'package:flutter/material.dart';
// import 'package:flutter_map/flutter_map.dart';
// import 'package:latlong2/latlong.dart';
// import 'package:geolocator/geolocator.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';

// import 'address_input_screen.dart';
// import 'notifications.dart';
// import 'profile.dart';
// import 'ride_history.dart';
// import 'phone_register_screen.dart';
// import '../theme/app_theme.dart';

// class RideBookingScreen extends StatefulWidget {
//   const RideBookingScreen({Key? key}) : super(key: key);

//   @override
//   State<RideBookingScreen> createState() => _RideBookingScreenState();
// }

// class _RideBookingScreenState extends State<RideBookingScreen> {
//   final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
//   late MapController _mapController;

//   LatLng? _currentLocation;
//   LatLng? _pickupPoint;
//   LatLng? _dropoffPoint;

//   String? _pickupName;
//   String? _dropoffName;
//   String _selectedRideType = "Standard";

//   List<LatLng> _routePolyline = [];
//   double? _routeDistanceKm;
//   double? _routeDurationMin;

//   bool _darkMode = false;

//   final List<Map<String, String>> rideTypes = [
//     {"type": "Vitz", "price": "100 ETB"},
//     {"type": "Hyundai", "price": "115 ETB"},
//     {"type": "Taxi", "price": "158 ETB"},
//   ];

//   @override
//   void initState() {
//     super.initState();
//     _mapController = MapController();
//     _requestLocation();
//   }

//   Future<void> _requestLocation() async {
//     bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
//     if (!serviceEnabled) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text('Please enable location services.')),
//       );
//       return;
//     }

//     LocationPermission permission = await Geolocator.checkPermission();
//     if (permission == LocationPermission.denied) {
//       permission = await Geolocator.requestPermission();
//       if (permission == LocationPermission.denied) return;
//     }

//     if (permission == LocationPermission.deniedForever) return;

//     Position position = await Geolocator.getCurrentPosition(
//       desiredAccuracy: LocationAccuracy.high,
//     );

//     setState(() {
//       _currentLocation = LatLng(position.latitude, position.longitude);
//     });

//     _mapController.move(_currentLocation!, 15);
//   }

//   Future<void> _drawRoute() async {
//     if (_pickupPoint == null || _dropoffPoint == null) return;

//     final url =
//         "https://router.project-osrm.org/route/v1/driving/${_pickupPoint!.longitude},${_pickupPoint!.latitude};${_dropoffPoint!.longitude},${_dropoffPoint!.latitude}?overview=full&geometries=geojson";

//     final response = await http.get(Uri.parse(url));

//     if (response.statusCode == 200) {
//       final data = json.decode(response.body);
//       final route = data['routes'][0]['geometry']['coordinates'] as List;

//       List<LatLng> polylinePoints =
//           route
//               .map((point) => LatLng(point[1] as double, point[0] as double))
//               .toList();

//       setState(() {
//         _routePolyline = polylinePoints;
//         _routeDistanceKm = (data['routes'][0]['distance'] as num) / 1000;
//         _routeDurationMin = (data['routes'][0]['duration'] as num) / 60;
//       });

//       _mapController.fitBounds(
//         LatLngBounds.fromPoints(polylinePoints),
//         options: const FitBoundsOptions(padding: EdgeInsets.all(50)),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     final theme = AppTheme.light();

//     return MaterialApp(
//       debugShowCheckedModeBanner: false, // <-- hides the debug banner
//       theme: _darkMode ? ThemeData.dark() : theme,
//       home: Scaffold(
//         key: _scaffoldKey,
//         drawer: _buildDrawer(theme.primaryColor),
//         appBar: AppBar(
//           title: const Text("Ride Booking Ethiopia"),
//           centerTitle: true,
//           backgroundColor: theme.primaryColor,
//           leading: IconButton(
//             icon: const Icon(Icons.menu),
//             onPressed: () => _scaffoldKey.currentState?.openDrawer(),
//           ),
//           actions: [
//             IconButton(
//               icon: const Icon(Icons.notifications),
//               onPressed: () {
//                 Navigator.push(
//                   context,
//                   MaterialPageRoute(builder: (_) => NotificationsScreen()),
//                 );
//               },
//             ),
//           ],
//         ),
//         body: Stack(
//           children: [_buildMap(), _buildBottomPanel(theme.primaryColor)],
//         ),
//       ),
//     );
//   }

//   Widget _buildMap() {
//     return Stack(
//       children: [
//         FlutterMap(
//           mapController: _mapController,
//           options: MapOptions(
//             center: _currentLocation ?? LatLng(9.03, 38.74),
//             zoom: 13,
//           ),
//           children: [
//             TileLayer(
//               urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//               subdomains: const ['a', 'b', 'c'],
//             ),
//             MarkerLayer(
//               markers: [
//                 if (_currentLocation != null)
//                   Marker(
//                     point: _currentLocation!,
//                     builder:
//                         (ctx) => const Icon(
//                           Icons.my_location,
//                           color: Colors.blue,
//                           size: 40,
//                         ),
//                   ),
//                 if (_pickupPoint != null)
//                   Marker(
//                     point: _pickupPoint!,
//                     builder:
//                         (ctx) => const Icon(
//                           Icons.location_on,
//                           color: Colors.green,
//                           size: 40,
//                         ),
//                   ),
//                 if (_dropoffPoint != null)
//                   Marker(
//                     point: _dropoffPoint!,
//                     builder:
//                         (ctx) => const Icon(
//                           Icons.location_on,
//                           color: Colors.red,
//                           size: 40,
//                         ),
//                   ),
//               ],
//             ),
//             if (_routePolyline.isNotEmpty)
//               PolylineLayer(
//                 polylines: [
//                   Polyline(
//                     points: _routePolyline,
//                     color: Theme.of(context).primaryColor,
//                     strokeWidth: 4,
//                   ),
//                 ],
//               ),
//           ],
//         ),
//         if (_routeDistanceKm != null && _routeDurationMin != null)
//           Positioned(
//             top: 10,
//             left: 20,
//             right: 20,
//             child: Container(
//               padding: const EdgeInsets.all(12),
//               decoration: BoxDecoration(
//                 color: Colors.white.withOpacity(0.9),
//                 borderRadius: BorderRadius.circular(8),
//                 boxShadow: [
//                   BoxShadow(
//                     color: Colors.black.withOpacity(0.2),
//                     blurRadius: 8,
//                   ),
//                 ],
//               ),
//               child: Row(
//                 mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                 children: [
//                   Text(
//                     "Distance: ${_routeDistanceKm!.toStringAsFixed(2)} km",
//                     style: const TextStyle(fontWeight: FontWeight.bold),
//                   ),
//                   Text(
//                     "Time: ${_routeDurationMin!.round()} min",
//                     style: const TextStyle(fontWeight: FontWeight.bold),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//       ],
//     );
//   }

//   Widget _buildBottomPanel(Color primaryColor) {
//     return Positioned(
//       bottom: 0,
//       left: 0,
//       right: 0,
//       child: SafeArea(
//         child: Container(
//           padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
//           decoration: BoxDecoration(
//             color: _darkMode ? Colors.grey[900] : Colors.white,
//             borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
//             boxShadow: [
//               BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 16),
//             ],
//           ),
//           child: Column(
//             mainAxisSize: MainAxisSize.min,
//             children: [
//               _buildLocationRow("Pickup", _pickupName, true, primaryColor),
//               const SizedBox(height: 10),
//               _buildLocationRow("Dropoff", _dropoffName, false, primaryColor),
//               const SizedBox(height: 20),
//               _buildRideTypeSelector(primaryColor),
//               const SizedBox(height: 24),
//               _buildOrderButton(primaryColor),
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildLocationRow(
//     String label,
//     String? location,
//     bool isPickup,
//     Color primaryColor,
//   ) {
//     return InkWell(
//       onTap: () async {
//         final result = await Navigator.push(
//           context,
//           MaterialPageRoute(builder: (_) => AddressInputScreen(places: {})),
//         );
//         if (result != null) {
//           setState(() {
//             if (isPickup) {
//               _pickupName = result['name'];
//               _pickupPoint = result['latLng'];
//             } else {
//               _dropoffName = result['name'];
//               _dropoffPoint = result['latLng'];
//             }
//           });
//           await _drawRoute();
//         }
//       },
//       child: Row(
//         children: [
//           Icon(
//             isPickup ? Icons.my_location : Icons.location_on,
//             color: primaryColor,
//             size: 28,
//           ),
//           const SizedBox(width: 16),
//           Expanded(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   label,
//                   style: const TextStyle(fontSize: 12, color: Colors.grey),
//                 ),
//                 Text(
//                   location ?? "Tap to select",
//                   style: const TextStyle(
//                     fontSize: 16,
//                     fontWeight: FontWeight.w600,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//           const Icon(Icons.edit, size: 22, color: Colors.grey),
//         ],
//       ),
//     );
//   }

//   Widget _buildRideTypeSelector(Color primaryColor) {
//     return SizedBox(
//       height: 110,
//       child: ListView.builder(
//         scrollDirection: Axis.horizontal,
//         itemCount: rideTypes.length,
//         itemBuilder: (context, index) {
//           final ride = rideTypes[index];
//           final isSelected = ride['type'] == _selectedRideType;
//           return GestureDetector(
//             onTap: () => setState(() => _selectedRideType = ride['type']!),
//             child: Container(
//               width: 140,
//               margin: const EdgeInsets.only(right: 16),
//               padding: const EdgeInsets.all(16),
//               decoration: BoxDecoration(
//                 color:
//                     isSelected
//                         ? primaryColor.withOpacity(0.15)
//                         : Colors.grey.shade100,
//                 borderRadius: BorderRadius.circular(14),
//                 border: Border.all(
//                   color: isSelected ? primaryColor : Colors.grey.shade300,
//                   width: isSelected ? 2 : 1,
//                 ),
//               ),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     ride['type']!,
//                     style: TextStyle(
//                       fontWeight: FontWeight.bold,
//                       color: isSelected ? primaryColor : Colors.black87,
//                       fontSize: 16,
//                     ),
//                   ),
//                   const Spacer(),
//                   Text(
//                     ride['price']!,
//                     style: TextStyle(
//                       fontWeight: FontWeight.bold,
//                       color: isSelected ? primaryColor : Colors.black87,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           );
//         },
//       ),
//     );
//   }

//   Widget _buildOrderButton(Color primaryColor) {
//     final isActive =
//         _pickupName != null &&
//         _dropoffName != null &&
//         _selectedRideType.isNotEmpty;

//     return ElevatedButton(
//       style: ElevatedButton.styleFrom(
//         backgroundColor:
//             isActive ? primaryColor : Colors.grey, // primary when active
//         minimumSize: const Size(double.infinity, 50),
//         shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//       ),
//       onPressed:
//           isActive
//               ? () {
//                 ScaffoldMessenger.of(context).showSnackBar(
//                   SnackBar(
//                     content: Text(
//                       "Ordered $_selectedRideType from $_pickupName to $_dropoffName",
//                     ),
//                   ),
//                 );
//               }
//               : null, // disabled when not active
//       child: Text(
//         "Order Ride",
//         style: TextStyle(
//           fontSize: 18,
//           fontWeight: FontWeight.bold,
//           color: Colors.white, // text always white
//         ),
//       ),
//     );
//   }

//   Widget _buildDrawer(Color primaryColor) {
//     return Drawer(
//       child: ListView(
//         padding: EdgeInsets.zero,
//         children: [
//           DrawerHeader(
//             decoration: BoxDecoration(color: primaryColor),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: const [
//                 CircleAvatar(radius: 30, child: Icon(Icons.person, size: 40)),
//                 SizedBox(height: 16),
//                 Text(
//                   "Welcome, User",
//                   style: TextStyle(
//                     color: Colors.white,
//                     fontSize: 18,
//                     fontWeight: FontWeight.bold,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//           _buildDrawerItem(Icons.history, "Ride History", () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => const RideHistoryScreen()),
//             );
//           }, primaryColor),
//           _buildDrawerItem(Icons.notifications, "Notifications", () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => NotificationsScreen()),
//             );
//           }, primaryColor),
//           _buildDrawerItem(Icons.person, "Profile", () {
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => const ProfilePage()),
//             );
//           }, primaryColor),
//           const Divider(),
//           SwitchListTile(
//             title: const Text("Dark Mode"),
//             value: _darkMode,
//             onChanged: (v) => setState(() => _darkMode = v),
//             secondary: const Icon(Icons.brightness_6),
//           ),
//           _buildDrawerItem(Icons.logout, "Logout", () {
//             Navigator.pushReplacement(
//               context,
//               MaterialPageRoute(builder: (_) => const PhoneRegisterScreen()),
//             );
//           }, primaryColor),
//         ],
//       ),
//     );
//   }

//   ListTile _buildDrawerItem(
//     IconData icon,
//     String title,
//     VoidCallback onTap,
//     Color primaryColor,
//   ) {
//     return ListTile(
//       leading: Icon(icon, color: primaryColor),
//       title: Text(title),
//       onTap: onTap,
//     );
//   }
// }
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
