
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';

class AddressInputScreen extends StatefulWidget {
  final Map<String, LatLng> places; // optional predefined places
  const AddressInputScreen({Key? key, required this.places}) : super(key: key);

  @override
  State<AddressInputScreen> createState() => _AddressInputScreenState();
}

class _AddressInputScreenState extends State<AddressInputScreen> {
  final TextEditingController _searchController = TextEditingController();
  final MapController _mapController = MapController();
  LatLng? _currentLocation;
  LatLng? _selectedPoint;
  String? _selectedAddress;
  double? _distanceKm;
  double? _durationMin;

  List<Map<String, dynamic>> _searchResults = [];

  @override
  void initState() {
    super.initState();
    _requestLocationPermission();
  }

  Future<void> _requestLocationPermission() async {
    LocationPermission permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Location permission is required")),
      );
    } else {
      Position pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      setState(() {
        _currentLocation = LatLng(pos.latitude, pos.longitude);
        _mapController.move(_currentLocation!, 15);
      });
    }
  }

  Future<void> _searchLocation(String query) async {
    final locationParam =
        _currentLocation != null
            ? "&lat=${_currentLocation!.latitude}&lon=${_currentLocation!.longitude}"
            : "";
    final url = Uri.parse(
      "https://photon.komoot.io/api/?q=$query$locationParam&limit=10&lang=en",
    );

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final features = data['features'] as List;

      setState(() {
        _searchResults =
            features
                .map((feature) {
                  final coords = feature['geometry']['coordinates'];
                  final lon = coords[0];
                  final lat = coords[1];
                  final props = feature['properties'];
                  final nameParts = [
                    if (props['name'] != null) props['name'],
                    if (props['city'] != null) props['city'],
                    if (props['country'] != null) props['country'],
                  ];
                  final displayName = nameParts.join(', ');
                  return {'name': displayName, 'latLng': LatLng(lat, lon)};
                })
                .where((item) {
                  final arabicRegex = RegExp(r'[\u0600-\u06FF]');
                  return !arabicRegex.hasMatch(item['name'] as String);
                })
                .toList();
      });
    } else {
      setState(() {
        _searchResults = [];
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("No results found")));
    }
  }

  Future<String> _getAddressFromLatLng(LatLng point) async {
    final url = Uri.parse(
      "https://photon.komoot.io/reverse?lat=${point.latitude}&lon=${point.longitude}&lang=en",
    );
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final features = data['features'] as List;
      if (features.isNotEmpty) {
        final props = features[0]['properties'];
        final nameParts = [
          if (props['name'] != null) props['name'],
          if (props['city'] != null) props['city'],
          if (props['country'] != null) props['country'],
        ];
        return nameParts.join(', ');
      }
    }
    return "Selected Location";
  }

  // Calculate distance and estimated time
  void _updateDistanceAndTime(LatLng point) {
    if (_currentLocation == null) return;
    final distance = Distance().as(
      LengthUnit.Kilometer,
      _currentLocation!,
      point,
    );
    const avgSpeedKmh = 40; // average speed in km/h
    final duration = (distance / avgSpeedKmh) * 60; // minutes
    setState(() {
      _distanceKm = distance;
      _durationMin = duration;
    });
  }

  void _selectLocation(LatLng point, [String? address]) async {
    String resolvedAddress = address ?? await _getAddressFromLatLng(point);
    setState(() {
      _selectedPoint = point;
      _selectedAddress = resolvedAddress;
      _mapController.move(point, 16);
      _searchResults.clear();
      _searchController.text = resolvedAddress;
    });
    _updateDistanceAndTime(point);
  }

  void _confirmLocation() {
    if (_selectedPoint != null && _selectedAddress != null) {
      Navigator.pop(context, {
        'name': _selectedAddress!,
        'latLng': _selectedPoint!,
        'distanceKm': _distanceKm,
        'durationMin': _durationMin,
      });
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Please select a location")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Select Location"),
        actions: [
          TextButton(
            onPressed: _confirmLocation,
            child: const Text(
              "Confirm",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: "Search for an address",
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchController.clear();
                        setState(() {
                          _searchResults.clear();
                        });
                      },
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onChanged: (query) {
                    if (query.isNotEmpty) _searchLocation(query);
                  },
                ),
                if (_distanceKm != null && _durationMin != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Distance: ${_distanceKm!.toStringAsFixed(2)} km"),
                        Text("Time: ${_durationMin!.round()} min"),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          Expanded(
            child: Stack(
              children: [
                FlutterMap(
                  mapController: _mapController,
                  options: MapOptions(
                    center: _currentLocation ?? LatLng(9.03, 38.74),
                    zoom: 13,
                    onTap: (tapPos, point) {
                      _selectLocation(point);
                    },
                  ),
                  children: [
                    TileLayer(
                      urlTemplate:
                          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                      subdomains: const ['a', 'b', 'c'],
                    ),
                    if (_selectedPoint != null)
                      MarkerLayer(
                        markers: [
                          Marker(
                            point: _selectedPoint!,
                            builder:
                                (ctx) => const Icon(
                                  Icons.location_on,
                                  color: Colors.red,
                                  size: 40,
                                ),
                          ),
                        ],
                      ),
                  ],
                ),
                if (_searchResults.isNotEmpty)
                  Positioned(
                    top: 80,
                    left: 12,
                    right: 12,
                    child: Material(
                      elevation: 4,
                      borderRadius: BorderRadius.circular(8),
                      child: ListView.builder(
                        shrinkWrap: true,
                        itemCount: _searchResults.length,
                        itemBuilder: (context, index) {
                          final item = _searchResults[index];
                          return ListTile(
                            title: Text(
                              item['name'],
                              style: const TextStyle(
                                fontFamily: 'NotoSansEthiopic',
                                fontSize: 16,
                              ),
                            ),
                            onTap:
                                () => _selectLocation(
                                  item['latLng'],
                                  item['name'],
                                ),
                          );
                        },
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
