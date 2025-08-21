

import 'package:country_picker/country_picker.dart';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../utils/validators.dart';
import '../widgets/terms_dialog.dart';
import 'otp_verify_screen.dart';

class PhoneRegisterScreen extends StatefulWidget {
  const PhoneRegisterScreen({Key? key}) : super(key: key);

  @override
  State<PhoneRegisterScreen> createState() => _PhoneRegisterScreenState();
}

class _PhoneRegisterScreenState extends State<PhoneRegisterScreen> {
  final _phoneCtrl = TextEditingController();
  String _countryCode = "+251";
  String _countryFlag = "🇪🇹"; // Default Ethiopia
  bool _agree = false;
  bool _loading = false;

  void _pickCountry() {
    final theme = Theme.of(context);
    showCountryPicker(
      context: context,
      showPhoneCode: true,
      countryListTheme: CountryListThemeData(
        flagSize: 25,
        backgroundColor: Colors.white,
        textStyle: TextStyle(fontSize: 16, color: Colors.grey[800]),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(8.0),
          topRight: Radius.circular(8.0),
        ),
        inputDecoration: InputDecoration(
          labelText: 'Search',
          hintText: 'Start typing to search',
          prefixIcon: const Icon(Icons.search),
          border: OutlineInputBorder(
            borderSide: BorderSide(color: theme.colorScheme.primary),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: theme.colorScheme.primary),
          ),
        ),
      ),
      onSelect: (country) {
        setState(() {
          _countryCode = "+${country.phoneCode}";
          _countryFlag = country.flagEmoji;
        });
      },
    );
  }

  bool get _isFormValid {
    return Validators.isValidPhone(_phoneCtrl.text) && _agree;
  }

  Future<void> _sendOtp() async {
    final phone = "$_countryCode${_phoneCtrl.text.trim()}";

    setState(() => _loading = true);
    final ok = await ApiService.sendOtp(phone);
    setState(() => _loading = false);

    if (ok) {
      Navigator.push(
        context,
        PageRouteBuilder(
          transitionDuration: const Duration(milliseconds: 500),
          pageBuilder: (_, __, ___) => OtpVerifyScreen(phone: phone, token: ''),
          transitionsBuilder:
              (_, anim, __, child) =>
                  ScaleTransition(scale: anim, child: child),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Failed to send OTP"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Login",
          style: theme.textTheme.titleLarge?.copyWith(color: Colors.white),
        ),
        backgroundColor: theme.colorScheme.primary,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: false, // <-- hides the back button
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: // Inside the Column in SingleChildScrollView
            Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Add your image here
            Center(
              child: Image.asset(
                'assets/images/welcome.png', // Make sure the path is correct
                width: 300,
                height: 300,
                fit: BoxFit.contain,
              ),
            ),
            const SizedBox(height: 24),

            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min, // shrink-wraps to content
                children: [
                  Text(
                    "Enter your phone number",
                    style: theme.textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "We will send you a verification code.",
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                    textAlign: TextAlign.center, // in case it's long text
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Country & phone input
            Row(
              children: [
                InkWell(
                  onTap: _pickCountry,
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 16,
                    ),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade400),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Text(
                          _countryFlag,
                          style: const TextStyle(fontSize: 20),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _countryCode,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(width: 4),
                        Icon(Icons.arrow_drop_down, color: Colors.grey[700]),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _phoneCtrl,
                    keyboardType: TextInputType.phone,
                    onChanged: (_) => setState(() {}),
                    decoration: InputDecoration(
                      hintText: "912345678",
                      hintStyle: TextStyle(color: Colors.grey[500]),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: Colors.grey.shade400),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(
                          color: theme.colorScheme.primary,
                          width: 1.5,
                        ),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                    ),
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Terms checkbox
            Row(
              children: [
                Checkbox(
                  value: _agree,
                  onChanged: (v) => setState(() => _agree = v!),
                  activeColor: theme.colorScheme.primary,
                ),
                Expanded(
                  child: GestureDetector(
                    onTap:
                        () => showDialog(
                          context: context,
                          builder: (_) => const TermsDialog(),
                        ),
                    child: RichText(
                      text: TextSpan(
                        text: "I agree to the ",
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[800],
                        ),
                        children: [
                          TextSpan(
                            text: "Terms & Conditions",
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.bold,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 32),

            // Get OTP button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isFormValid && !_loading ? _sendOtp : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor:
                      _isFormValid
                          ? theme.colorScheme.primary
                          : Colors.grey[400],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 3,
                  shadowColor:
                      _isFormValid
                          ? theme.colorScheme.primary.withOpacity(0.3)
                          : Colors.transparent,
                ),
                child:
                    _loading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : Text(
                          "Get Code",
                          style: theme.textTheme.labelLarge?.copyWith(
                            color: Colors.white,
                          ),
                        ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
