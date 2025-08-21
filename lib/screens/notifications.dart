
import 'package:flutter/material.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<Map<String, String>> notifications = [
    {
      'title': 'Ride Confirmed',
      'message': 'Your ride from Mekelle to Adigrat is booked.',
    },
    {
      'title': 'Driver Arriving',
      'message': 'Your driver will arrive in 5 minutes.',
    },
    {
      'title': 'Payment Successful',
      'message': 'You paid ETB 200 for your last trip.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Notifications',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: primaryColor,
        centerTitle: true,
        elevation: 0,
      ),
      body:
          notifications.isEmpty
              ? const Center(
                child: Text(
                  "No notifications yet",
                  style: TextStyle(fontSize: 16, color: Colors.grey),
                ),
              )
              : ListView.builder(
                itemCount: notifications.length,
                itemBuilder: (context, index) {
                  final item = notifications[index];
                  return Dismissible(
                    key: Key(item['title']! + index.toString()),
                    direction: DismissDirection.horizontal,
                    background: _buildSwipeBackground(
                      Alignment.centerLeft,
                      Icons.delete,
                      Colors.red,
                    ),
                    secondaryBackground: _buildSwipeBackground(
                      Alignment.centerRight,
                      Icons.delete,
                      Colors.red,
                    ),
                    onDismissed: (direction) {
                      setState(() => notifications.removeAt(index));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text("${item['title']} deleted"),
                          backgroundColor: Colors.red,
                        ),
                      );
                    },
                    child: Card(
                      elevation: 2,
                      margin: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: primaryColor.withOpacity(0.1),
                          child: Icon(Icons.notifications, color: primaryColor),
                        ),
                        title: Text(
                          item['title']!,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: primaryColor,
                          ),
                        ),
                        subtitle: Text(
                          item['message']!,
                          style: const TextStyle(color: Colors.black87),
                        ),
                        trailing: const Icon(
                          Icons.chevron_right,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                  );
                },
              ),
    );
  }

  Widget _buildSwipeBackground(
    Alignment alignment,
    IconData icon,
    Color color,
  ) {
    return Container(
      alignment: alignment,
      color: color,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Icon(icon, color: Colors.white),
    );
  }
}

