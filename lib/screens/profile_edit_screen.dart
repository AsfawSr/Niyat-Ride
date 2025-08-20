// import 'package:flutter/material.dart';
// import '../models/user.dart';
// import '../services/api_service.dart';

// class ProfileEditScreen extends StatefulWidget {
//   final String token;
//   final Map<String, dynamic> profile;
//   const ProfileEditScreen({
//     Key? key,
//     required this.token,
//     required this.profile,
//   }) : super(key: key);

//   @override
//   State<ProfileEditScreen> createState() => _ProfileEditScreenState();
// }

// class _ProfileEditScreenState extends State<ProfileEditScreen> {
//   late TextEditingController _first;
//   late TextEditingController _last;
//   late TextEditingController _email;
//   bool _loading = false;

//   @override
//   void initState() {
//     super.initState();
//     _first = TextEditingController(text: widget.profile['firstName'] ?? "");
//     _last = TextEditingController(text: widget.profile['lastName'] ?? "");
//     _email = TextEditingController(text: widget.profile['email'] ?? "");
//   }

//   Future<void> _saveProfile() async {
//     setState(() => _loading = true);
//     final ok = await ApiService.updateProfile(
//       widget.token,
//       UserModel(
//         phone: widget.profile['phone'],
//         firstName: _first.text.trim(),
//         lastName: _last.text.trim(),
//         email: _email.text.trim(),
//       ),
//     );
//     setState(() => _loading = false);

//     if (ok) {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(const SnackBar(content: Text("Profile updated")));
//     } else {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(const SnackBar(content: Text("Update failed")));
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text("Edit Profile")),
//       body: Padding(
//         padding: const EdgeInsets.all(18.0),
//         child: Column(
//           children: [
//             TextField(
//               controller: _first,
//               decoration: const InputDecoration(labelText: "First Name"),
//             ),
//             const SizedBox(height: 10),
//             TextField(
//               controller: _last,
//               decoration: const InputDecoration(labelText: "Last Name"),
//             ),
//             const SizedBox(height: 10),
//             TextField(
//               controller: _email,
//               decoration: const InputDecoration(labelText: "Email"),
//             ),
//             const SizedBox(height: 20),
//             SizedBox(
//               width: double.infinity,
//               child: ElevatedButton(
//                 onPressed: _loading ? null : _saveProfile,
//                 child:
//                     _loading
//                         ? const CircularProgressIndicator(color: Colors.white)
//                         : const Text("Save"),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// import 'package:flutter/material.dart';
// import '../models/user.dart';
// import '../services/api_service.dart';

// class ProfileEditScreen extends StatefulWidget {
//   final String token;
//   final Map<String, dynamic> profile;
//   const ProfileEditScreen({
//     Key? key,
//     required this.token,
//     required this.profile,
//   }) : super(key: key);

//   @override
//   State<ProfileEditScreen> createState() => _ProfileEditScreenState();
// }

// class _ProfileEditScreenState extends State<ProfileEditScreen> {
//   late TextEditingController _first;
//   late TextEditingController _last;
//   late TextEditingController _email;
//   bool _loading = false;
//   bool _isEditing = false; // toggle edit mode

//   @override
//   void initState() {
//     super.initState();
//     _first = TextEditingController(text: widget.profile['firstName'] ?? "");
//     _last = TextEditingController(text: widget.profile['lastName'] ?? "");
//     _email = TextEditingController(text: widget.profile['email'] ?? "");
//   }

//   Future<void> _saveProfile() async {
//     setState(() => _loading = true);
//     final ok = await ApiService.updateProfile(
//       widget.token,
//       UserModel(
//         phone: widget.profile['phone'],
//         firstName: _first.text.trim(),
//         lastName: _last.text.trim(),
//         email: _email.text.trim(),
//       ),
//     );
//     setState(() => _loading = false);

//     if (ok) {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(const SnackBar(content: Text("Profile updated")));
//       setState(() => _isEditing = false);
//     } else {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(const SnackBar(content: Text("Update failed")));
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text("Profile"),
//         actions: [
//           if (!_isEditing)
//             IconButton(
//               icon: const Icon(Icons.edit),
//               onPressed: () => setState(() => _isEditing = true),
//             ),
//         ],
//       ),
//       // Scrollable content to prevent overflow when keyboard pops up
//       body: SingleChildScrollView(
//         padding: const EdgeInsets.all(18),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             TextField(
//               controller: _first,
//               enabled: _isEditing,
//               decoration: const InputDecoration(
//                 labelText: "First Name",
//                 prefixIcon: Icon(Icons.person),
//               ),
//             ),
//             const SizedBox(height: 10),
//             TextField(
//               controller: _last,
//               enabled: _isEditing,
//               decoration: const InputDecoration(
//                 labelText: "Last Name",
//                 prefixIcon: Icon(Icons.person_outline),
//               ),
//             ),
//             const SizedBox(height: 10),
//             TextField(
//               controller: _email,
//               enabled: _isEditing,
//               decoration: const InputDecoration(
//                 labelText: "Email",
//                 prefixIcon: Icon(Icons.email),
//               ),
//             ),
//             const SizedBox(height: 30),
//             // Show Save button only in editing mode
//             if (_isEditing)
//               SizedBox(
//                 width: double.infinity,
//                 child: ElevatedButton(
//                   onPressed: _loading ? null : _saveProfile,
//                   style: ElevatedButton.styleFrom(
//                     padding: const EdgeInsets.symmetric(vertical: 15),
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(12),
//                     ),
//                   ),
//                   child:
//                       _loading
//                           ? const SizedBox(
//                             height: 20,
//                             width: 20,
//                             child: CircularProgressIndicator(
//                               color: Colors.white,
//                               strokeWidth: 2,
//                             ),
//                           )
//                           : const Text("Save", style: TextStyle(fontSize: 16)),
//                 ),
//               ),
//           ],
//         ),
//       ),
//     );
//   }
// }
