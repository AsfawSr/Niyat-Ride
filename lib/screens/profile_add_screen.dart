// import 'package:flutter/material.dart';
// import '../models/user.dart';
// import '../services/api_service.dart';
// import 'RideBookingScreen.dart';

// class ProfileAddScreen extends StatefulWidget {
//   final String token;
//   final String phone;

//   const ProfileAddScreen({Key? key, required this.token, required this.phone})
//     : super(key: key);

//   @override
//   State<ProfileAddScreen> createState() => _ProfileAddScreenState();
// }

// class _ProfileAddScreenState extends State<ProfileAddScreen> {
//   late TextEditingController _first;
//   late TextEditingController _last;
//   late TextEditingController _email;
//   bool _loading = false;
//   final Color _primaryColor = const Color(0xFF2E3192);

//   @override
//   void initState() {
//     super.initState();
//     _first = TextEditingController();
//     _last = TextEditingController();
//     _email = TextEditingController();
//   }

//   @override
//   void dispose() {
//     _first.dispose();
//     _last.dispose();
//     _email.dispose();
//     super.dispose();
//   }

//   Future<void> _submitProfile() async {
//     if (_first.text.trim().isEmpty ||
//         _last.text.trim().isEmpty ||
//         _email.text.trim().isEmpty) {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(const SnackBar(content: Text("All fields are required")));
//       return;
//     }

//     setState(() => _loading = true);

//     final ok = await ApiService.updateProfile(
//       widget.token,
//       UserModel(
//         phone: widget.phone,
//         firstName: _first.text.trim(),
//         lastName: _last.text.trim(),
//         email: _email.text.trim(),
//       ),
//     );

//     setState(() => _loading = false);

//     if (ok) {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(const SnackBar(content: Text("Profile saved")));
//       Navigator.pushReplacement(
//         context,
//         MaterialPageRoute(builder: (_) => const RideBookingScreen()),
//       );
//     } else {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(const SnackBar(content: Text("Failed to save profile")));
//     }
//   }

//   void _skipProfile() {
//     Navigator.pushReplacement(
//       context,
//       MaterialPageRoute(builder: (_) => const RideBookingScreen()),
//     );
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       appBar: AppBar(
//         title: const Text("Complete Profile"),
//         backgroundColor: _primaryColor,
//         centerTitle: true,
//         elevation: 0,
//       ),
//       body: SafeArea(
//         child: Padding(
//           padding: const EdgeInsets.all(18.0),
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               const Text(
//                 "Please complete your profile to continue",
//                 style: TextStyle(fontSize: 16, color: Colors.black54),
//               ),
//               const SizedBox(height: 20),
//               Text(
//                 "Phone Number",
//                 style: const TextStyle(
//                   fontSize: 16,
//                   fontWeight: FontWeight.bold,
//                 ),
//               ),
//               const SizedBox(height: 5),
//               Text(
//                 widget.phone,
//                 style: TextStyle(fontSize: 18, color: Colors.blueGrey[700]),
//               ),
//               const SizedBox(height: 20),

//               _buildTextField("First Name", _first),
//               const SizedBox(height: 15),
//               _buildTextField("Last Name", _last),
//               const SizedBox(height: 15),
//               _buildTextField(
//                 "Email",
//                 _email,
//                 keyboardType: TextInputType.emailAddress,
//               ),

//               const Spacer(),

//               // Submit button
//               SizedBox(
//                 width: double.infinity,
//                 height: 50,
//                 child: ElevatedButton(
//                   onPressed: _loading ? null : _submitProfile,
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: _primaryColor,
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(14),
//                     ),
//                   ),
//                   child:
//                       _loading
//                           ? const CircularProgressIndicator(color: Colors.white)
//                           : const Text(
//                             "Submit",
//                             style: TextStyle(
//                               fontSize: 18,
//                               fontWeight: FontWeight.bold,
//                             ),
//                           ),
//                 ),
//               ),

//               const SizedBox(height: 15),

//               // Skip button
//               Center(
//                 child: TextButton(
//                   onPressed: _skipProfile,
//                   child: const Text(
//                     "Skip for now",
//                     style: TextStyle(
//                       fontSize: 16,
//                       color: Colors.grey,
//                       decoration: TextDecoration.underline,
//                     ),
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildTextField(
//     String label,
//     TextEditingController controller, {
//     TextInputType keyboardType = TextInputType.text,
//   }) {
//     return TextField(
//       controller: controller,
//       keyboardType: keyboardType,
//       decoration: InputDecoration(
//         labelText: label,
//         border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
//         focusedBorder: OutlineInputBorder(
//           borderRadius: BorderRadius.circular(12),
//           borderSide: BorderSide(color: _primaryColor, width: 2),
//         ),
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import 'RideBookingScreen.dart';

class ProfileAddScreen extends StatefulWidget {
  final String token;
  final String phone;

  const ProfileAddScreen({Key? key, required this.token, required this.phone})
    : super(key: key);

  @override
  State<ProfileAddScreen> createState() => _ProfileAddScreenState();
}

class _ProfileAddScreenState extends State<ProfileAddScreen> {
  late TextEditingController _first;
  late TextEditingController _last;
  late TextEditingController _email;
  bool _loading = false;
  bool _isEditing = true; // allow editing by default

  @override
  void initState() {
    super.initState();
    _first = TextEditingController();
    _last = TextEditingController();
    _email = TextEditingController();
  }

  @override
  void dispose() {
    _first.dispose();
    _last.dispose();
    _email.dispose();
    super.dispose();
  }

  Future<void> _submitProfile() async {
    if (_first.text.trim().isEmpty ||
        _last.text.trim().isEmpty ||
        _email.text.trim().isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("All fields are required")));
      return;
    }

    setState(() => _loading = true);

    final ok = await ApiService.updateProfile(
      widget.token,
      UserModel(
        phone: widget.phone,
        firstName: _first.text.trim(),
        lastName: _last.text.trim(),
        email: _email.text.trim(),
      ),
    );

    setState(() => _loading = false);

    if (ok) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Profile saved")));
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const RideBookingScreen()),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Failed to save profile")));
    }
  }

  void _skipProfile() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const RideBookingScreen()),
    );
  }

  Future<bool> _onWillPop() async {
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text("Log Out"),
            content: const Text("Do you want to log out?"),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text("Cancel"),
              ),
              TextButton(
                onPressed: () => Navigator.of(context).pop(true),
                child: const Text("Log Out"),
              ),
            ],
          ),
    );
    return shouldLogout ?? false;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primaryColor = theme.primaryColor;
    final surfaceColor = theme.colorScheme.surface;
    final backgroundColor = theme.colorScheme.background;

    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        backgroundColor: backgroundColor,
        appBar: AppBar(
          title: const Text("Complete Profile"),
          backgroundColor: primaryColor,
          centerTitle: true,
          automaticallyImplyLeading: false, // hides the AppBar back button
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: primaryColor,
                  child: Text(
                    "${_first.text.isNotEmpty ? _first.text[0].toUpperCase() : "?"}${_last.text.isNotEmpty ? _last.text[0].toUpperCase() : "?"}",
                    style: const TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Center(
                  child: Text(
                    widget.phone,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                _buildEditableField(
                  "First Name",
                  _first,
                  primaryColor,
                  surfaceColor,
                ),
                _buildEditableField(
                  "Last Name",
                  _last,
                  primaryColor,
                  surfaceColor,
                ),
                _buildEditableField(
                  "Email",
                  _email,
                  primaryColor,
                  surfaceColor,
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _loading ? null : _submitProfile,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          backgroundColor: primaryColor,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child:
                            _loading
                                ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                                : const Text(
                                  "Submit",
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.white,
                                  ),
                                ),
                      ),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _skipProfile,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          backgroundColor: primaryColor.withOpacity(0.7),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          "Skip",
                          style: TextStyle(fontSize: 16, color: Colors.white),
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
    );
  }

  Widget _buildEditableField(
    String label,
    TextEditingController controller,
    Color primaryColor,
    Color fillColor, {
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: TextField(
        controller: controller,
        readOnly: !_isEditing,
        textCapitalization: TextCapitalization.words,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: fillColor,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: primaryColor, width: 2),
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        onChanged: (_) => setState(() {}),
      ),
    );
  }
}
