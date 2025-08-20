import 'package:flutter/material.dart';

class TermsDialog extends StatelessWidget {
  const TermsDialog({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Terms & Conditions"),
      content: const SingleChildScrollView(
        child: Text(
          "By using this app, you agree to our terms and privacy policy...",
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text("Close"),
        ),
      ],
    );
  }
}
