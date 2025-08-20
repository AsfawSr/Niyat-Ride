// import 'package:flutter/material.dart';

// class ProfilePage extends StatefulWidget {
//   const ProfilePage({super.key});

//   @override
//   State<ProfilePage> createState() => _ProfilePageState();
// }

// class _ProfilePageState extends State<ProfilePage> {
//   final Color primaryColor = const Color(0xFF2E3192);

//   // Controllers for editable fields
//   final TextEditingController firstNameController = TextEditingController(
//     text: "John",
//   );
//   final TextEditingController lastNameController = TextEditingController(
//     text: "Doe",
//   );
//   final TextEditingController emailController = TextEditingController(
//     text: "user@example.com",
//   );

//   String phoneNumber = "+251 900 000 000";
//   bool isEditing = false;

//   String _initials() {
//     final f = firstNameController.text.trim();
//     final l = lastNameController.text.trim();
//     final fi = f.isNotEmpty ? f[0].toUpperCase() : "";
//     final li = l.isNotEmpty ? l[0].toUpperCase() : "";
//     final text = (fi + li);
//     return text.isEmpty ? "?" : text;
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       appBar: AppBar(
//         title: const Text("Profile"),
//         backgroundColor: primaryColor,
//         centerTitle: true,
//         elevation: 0,
//         actions: [
//           IconButton(
//             icon: Icon(isEditing ? Icons.check : Icons.edit),
//             onPressed: () {
//               setState(() => isEditing = !isEditing);
//               if (!isEditing) {
//                 ScaffoldMessenger.of(context).showSnackBar(
//                   const SnackBar(content: Text("Profile saved successfully")),
//                 );
//               }
//             },
//           ),
//         ],
//       ),
//       body: ListView(
//         padding: const EdgeInsets.all(20),
//         children: [
//           // Circle avatar with initials
//           CircleAvatar(
//             radius: 50,
//             backgroundColor: primaryColor,
//             child: Text(
//               _initials(),
//               style: const TextStyle(
//                 fontSize: 30,
//                 fontWeight: FontWeight.bold,
//                 color: Colors.white,
//               ),
//             ),
//           ),
//           const SizedBox(height: 12),

//           // Phone number prominently displayed
//           Center(
//             child: Text(
//               phoneNumber,
//               style: const TextStyle(
//                 fontSize: 18,
//                 fontWeight: FontWeight.bold,
//                 color: Colors.black87,
//               ),
//             ),
//           ),
//           const SizedBox(height: 25),

//           // Editable Fields
//           _buildEditableField("First Name", firstNameController),
//           _buildEditableField("Last Name", lastNameController),
//           _buildEditableField("Email", emailController),
//         ],
//       ),
//     );
//   }

//   Widget _buildEditableField(String label, TextEditingController controller) {
//     return Padding(
//       padding: const EdgeInsets.only(bottom: 15),
//       child: TextField(
//         controller: controller,
//         readOnly: !isEditing,
//         textCapitalization: TextCapitalization.words,
//         decoration: InputDecoration(
//           labelText: label,
//           filled: true,
//           fillColor: Colors.grey.shade100,
//           border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
//           focusedBorder: OutlineInputBorder(
//             borderSide: BorderSide(color: primaryColor, width: 2),
//             borderRadius: BorderRadius.circular(12),
//           ),
//         ),
//         onChanged: (_) => setState(() {}), // updates initials live
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final TextEditingController firstNameController = TextEditingController(
    text: "Robel",
  );
  final TextEditingController lastNameController = TextEditingController(
    text: "Guesh",
  );
  final TextEditingController emailController = TextEditingController(
    text: "user@example.com",
  );

  String phoneNumber = "+251 900 000 000";
  bool isEditing = false;

  String _initials() {
    final f = firstNameController.text.trim();
    final l = lastNameController.text.trim();
    final fi = f.isNotEmpty ? f[0].toUpperCase() : "";
    final li = l.isNotEmpty ? l[0].toUpperCase() : "";
    return (fi + li).isEmpty ? "?" : fi + li;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primaryColor = theme.primaryColor;
    final surfaceColor = theme.colorScheme.surface;
    final backgroundColor = theme.colorScheme.background;

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        title: const Text("Profile"),
        backgroundColor: primaryColor,
        centerTitle: true,
        elevation: 0,
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
                  _initials(),
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
                  phoneNumber,
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
                firstNameController,
                primaryColor,
                surfaceColor,
              ),
              _buildEditableField(
                "Last Name",
                lastNameController,
                primaryColor,
                surfaceColor,
              ),
              _buildEditableField(
                "Email",
                emailController,
                primaryColor,
                surfaceColor,
              ),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    setState(() => isEditing = !isEditing);
                    if (!isEditing) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("Profile saved successfully"),
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    backgroundColor: primaryColor, // use primary color
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    isEditing ? "Save" : "Press to Edit",
                    style: const TextStyle(color: Colors.white), // white text
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEditableField(
    String label,
    TextEditingController controller,
    Color primaryColor,
    Color fillColor,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: TextField(
        controller: controller,
        readOnly: !isEditing,
        textCapitalization: TextCapitalization.words,
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
