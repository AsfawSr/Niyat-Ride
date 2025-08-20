// import 'package:flutter/material.dart';
// import 'package:intl/intl.dart';

// class RideHistoryScreen extends StatefulWidget {
//   const RideHistoryScreen({super.key});

//   @override
//   State<RideHistoryScreen> createState() => _RideHistoryScreenState();
// }

// class _RideHistoryScreenState extends State<RideHistoryScreen> {
//   final List<Map<String, dynamic>> rideHistory = [
//     {
//       'pickup': 'Mekelle University Main Gate',
//       'dropoff': 'Mekelle Ayder Hospital',
//       'fare': 120.50,
//       'date': DateTime.now().subtract(const Duration(days: 1)),
//       'status': 'Completed',
//     },
//     {
//       'pickup': 'Adigrat Bus Station',
//       'dropoff': 'Adigrat Central Market',
//       'fare': 50.00,
//       'date': DateTime.now().subtract(const Duration(days: 3)),
//       'status': 'Cancelled',
//     },
//     {
//       'pickup': 'Hawzen Town Center',
//       'dropoff': 'Gheralta Lodge',
//       'fare': 250.75,
//       'date': DateTime.now().subtract(const Duration(days: 7)),
//       'status': 'Completed',
//     },
//   ];

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text(
//           'Ride History',
//           style: TextStyle(fontWeight: FontWeight.bold),
//         ),
//         backgroundColor: const Color(0xFF2E3192),
//         centerTitle: true,
//         elevation: 2,
//       ),
//       body:
//           rideHistory.isEmpty
//               ? const Center(
//                 child: Text(
//                   "No ride history yet",
//                   style: TextStyle(fontSize: 16, color: Colors.grey),
//                 ),
//               )
//               : ListView.builder(
//                 padding: const EdgeInsets.all(12),
//                 itemCount: rideHistory.length,
//                 itemBuilder: (context, index) {
//                   final ride = rideHistory[index];
//                   final bool completed = ride['status'] == 'Completed';

//                   return Dismissible(
//                     key: Key(
//                       ride['pickup'] + ride['dropoff'] + index.toString(),
//                     ),
//                     direction: DismissDirection.horizontal,
//                     background: _buildSwipeBackground(Alignment.centerLeft),
//                     secondaryBackground: _buildSwipeBackground(
//                       Alignment.centerRight,
//                     ),
//                     onDismissed: (_) {
//                       setState(() {
//                         rideHistory.removeAt(index);
//                       });
//                       ScaffoldMessenger.of(context).showSnackBar(
//                         SnackBar(
//                           content: Text(
//                             "${ride['pickup']} → ${ride['dropoff']} deleted",
//                           ),
//                         ),
//                       );
//                     },
//                     child: Card(
//                       margin: const EdgeInsets.symmetric(vertical: 8),
//                       elevation: 3,
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.circular(12),
//                       ),
//                       child: ListTile(
//                         contentPadding: const EdgeInsets.all(12),
//                         leading: CircleAvatar(
//                           backgroundColor:
//                               completed ? Colors.green : Colors.red,
//                           child: Icon(
//                             completed ? Icons.check : Icons.close,
//                             color: Colors.white,
//                           ),
//                         ),
//                         title: Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Text(
//                               '${ride['pickup']} → ${ride['dropoff']}',
//                               style: const TextStyle(
//                                 fontWeight: FontWeight.bold,
//                                 fontSize: 16,
//                               ),
//                             ),
//                             const SizedBox(height: 4),
//                             Text(
//                               DateFormat(
//                                 'EEE, dd MMM yyyy – hh:mm a',
//                               ).format(ride['date']),
//                               style: const TextStyle(
//                                 color: Colors.grey,
//                                 fontSize: 12,
//                               ),
//                             ),
//                           ],
//                         ),
//                         subtitle: Padding(
//                           padding: const EdgeInsets.only(top: 8),
//                           child: Text(
//                             'Fare: ${ride['fare'].toStringAsFixed(2)} ETB',
//                             style: const TextStyle(
//                               color: Colors.black87,
//                               fontWeight: FontWeight.w500,
//                             ),
//                           ),
//                         ),
//                         trailing: Container(
//                           padding: const EdgeInsets.symmetric(
//                             horizontal: 8,
//                             vertical: 4,
//                           ),
//                           decoration: BoxDecoration(
//                             color:
//                                 completed
//                                     ? Colors.green.shade100
//                                     : Colors.red.shade100,
//                             borderRadius: BorderRadius.circular(8),
//                           ),
//                           child: Text(
//                             ride['status'],
//                             style: TextStyle(
//                               color: completed ? Colors.green : Colors.red,
//                               fontWeight: FontWeight.bold,
//                             ),
//                           ),
//                         ),
//                       ),
//                     ),
//                   );
//                 },
//               ),
//     );
//   }

//   Widget _buildSwipeBackground(Alignment alignment) {
//     return Container(
//       alignment: alignment,
//       color: Colors.red,
//       padding: const EdgeInsets.symmetric(horizontal: 20),
//       child: const Icon(Icons.delete, color: Colors.white),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class RideHistoryScreen extends StatefulWidget {
  const RideHistoryScreen({super.key});

  @override
  State<RideHistoryScreen> createState() => _RideHistoryScreenState();
}

class _RideHistoryScreenState extends State<RideHistoryScreen> {
  final List<Map<String, dynamic>> rideHistory = [
    {
      'pickup': 'Mekelle University Main Gate',
      'dropoff': 'Mekelle Ayder Hospital',
      'fare': 120.50,
      'date': DateTime.now().subtract(const Duration(days: 1)),
      'status': 'Completed',
    },
    {
      'pickup': 'Adigrat Bus Station',
      'dropoff': 'Adigrat Central Market',
      'fare': 50.00,
      'date': DateTime.now().subtract(const Duration(days: 3)),
      'status': 'Cancelled',
    },
    {
      'pickup': 'Hawzen Town Center',
      'dropoff': 'Gheralta Lodge',
      'fare': 250.75,
      'date': DateTime.now().subtract(const Duration(days: 7)),
      'status': 'Completed',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Ride History',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: primaryColor,
        centerTitle: true,
        elevation: 2,
      ),
      body:
          rideHistory.isEmpty
              ? const Center(
                child: Text(
                  "No ride history yet",
                  style: TextStyle(fontSize: 16, color: Colors.grey),
                ),
              )
              : ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: rideHistory.length,
                itemBuilder: (context, index) {
                  final ride = rideHistory[index];
                  final bool completed = ride['status'] == 'Completed';
                  return Dismissible(
                    key: Key(
                      ride['pickup'] + ride['dropoff'] + index.toString(),
                    ),
                    direction: DismissDirection.horizontal,
                    background: _buildSwipeBackground(Alignment.centerLeft),
                    secondaryBackground: _buildSwipeBackground(
                      Alignment.centerRight,
                    ),
                    onDismissed: (_) {
                      setState(() => rideHistory.removeAt(index));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            "${ride['pickup']} → ${ride['dropoff']} deleted",
                          ),
                        ),
                      );
                    },
                    child: Card(
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      elevation: 3,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(12),
                        leading: CircleAvatar(
                          backgroundColor:
                              completed
                                  ? primaryColor.withOpacity(0.7)
                                  : Colors.red.shade400,
                          child: Icon(
                            completed ? Icons.check : Icons.close,
                            color: Colors.white,
                          ),
                        ),
                        title: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${ride['pickup']} → ${ride['dropoff']}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              DateFormat(
                                'EEE, dd MMM yyyy – hh:mm a',
                              ).format(ride['date']),
                              style: const TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            'Fare: ${ride['fare'].toStringAsFixed(2)} ETB',
                            style: const TextStyle(
                              color: Colors.black87,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color:
                                completed
                                    ? primaryColor.withOpacity(0.1)
                                    : Colors.red.shade100,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            ride['status'],
                            style: TextStyle(
                              color: completed ? primaryColor : Colors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
    );
  }

  Widget _buildSwipeBackground(Alignment alignment) {
    return Container(
      alignment: alignment,
      color: Colors.red,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: const Icon(Icons.delete, color: Colors.white),
    );
  }
}
