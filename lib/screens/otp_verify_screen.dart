// import 'dart:async';
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:flutter_otp_text_field/flutter_otp_text_field.dart';
// import 'RideBookingScreen.dart';
// import 'profile_add_screen.dart';

// class OtpVerifyScreen extends StatefulWidget {
//   final String phone;
//   final String token;

//   const OtpVerifyScreen({Key? key, required this.phone, required this.token})
//     : super(key: key);

//   @override
//   State<OtpVerifyScreen> createState() => _OtpVerifyScreenState();
// }

// class _OtpVerifyScreenState extends State<OtpVerifyScreen> {
//   String _otp = "";
//   bool _loading = false;
//   bool _showError = false;
//   final Color _primaryColor = const Color(0xFF2E3192);
//   int _resendCountdown = 30;
//   late Timer _timer;

//   @override
//   void initState() {
//     super.initState();
//     _startResendTimer();
//   }

//   void _startResendTimer() {
//     _resendCountdown = 30;
//     _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
//       if (_resendCountdown == 0) {
//         timer.cancel();
//       } else {
//         setState(() => _resendCountdown--);
//       }
//     });
//   }

//   @override
//   void dispose() {
//     _timer.cancel();
//     super.dispose();
//   }

//   Future<void> _verifyOtp() async {
//     if (_otp != "12345") {
//       setState(() {
//         _showError = true;
//       });
//       HapticFeedback.vibrate();
//       return;
//     }

//     setState(() {
//       _loading = true;
//       _showError = false;
//     });

//     await Future.delayed(const Duration(seconds: 1)); // simulate API delay

//     setState(() => _loading = false);

//     if (widget.phone == "+251945989369") {
//       // Registered user
//       Navigator.pushReplacement(
//         context,
//         MaterialPageRoute(builder: (_) => const RideBookingScreen()),
//       );
//     } else {
//       // New user
//       Navigator.pushReplacement(
//         context,
//         MaterialPageRoute(
//           builder:
//               (_) => ProfileAddScreen(token: widget.token, phone: widget.phone),
//         ),
//       );
//     }
//   }

//   void _resendOtp() {
//     if (_resendCountdown == 0) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(
//           content: Text("OTP resent"),
//           backgroundColor: Colors.green,
//         ),
//       );
//       _startResendTimer();
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       appBar: AppBar(
//         title: const Text("OTP Verification"),
//         backgroundColor: _primaryColor,
//         elevation: 0,
//         centerTitle: true,
//       ),
//       body: Padding(
//         padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.center,
//           children: [
//             const Icon(Icons.lock_outline, size: 80, color: Color(0xFF2E3192)),
//             const SizedBox(height: 20),
//             Text(
//               "Enter the 5-digit code sent to",
//               style: TextStyle(fontSize: 16, color: Colors.grey[700]),
//               textAlign: TextAlign.center,
//             ),
//             const SizedBox(height: 8),
//             Text(
//               widget.phone,
//               style: TextStyle(
//                 fontSize: 22,
//                 fontWeight: FontWeight.bold,
//                 color: _primaryColor,
//               ),
//               textAlign: TextAlign.center,
//             ),
//             const SizedBox(height: 40),

//             // OTP Input
//             OtpTextField(
//               numberOfFields: 5,
//               borderColor: Colors.grey.shade400,
//               focusedBorderColor: _primaryColor,
//               showFieldAsBox: true,
//               borderWidth: 2,
//               fieldWidth: 50,
//               borderRadius: BorderRadius.circular(12),
//               keyboardType: TextInputType.number,
//               onCodeChanged: (code) {
//                 setState(() {
//                   _otp = code;
//                   _showError = false;
//                 });
//               },
//               onSubmit: (code) {
//                 _otp = code;
//                 if (!_loading) _verifyOtp();
//               },
//             ),

//             if (_showError)
//               Padding(
//                 padding: const EdgeInsets.only(top: 12),
//                 child: Text(
//                   "Invalid OTP, please try again.",
//                   style: TextStyle(color: Colors.red.shade700),
//                 ),
//               ),

//             const SizedBox(height: 30),

//             // Verify Button
//             ElevatedButton(
//               onPressed: _otp.length == 5 && !_loading ? _verifyOtp : null,
//               style: ElevatedButton.styleFrom(
//                 backgroundColor:
//                     _otp.length == 5 && !_loading
//                         ? _primaryColor
//                         : Colors.grey.shade400,
//                 minimumSize: const Size.fromHeight(50),
//                 shape: RoundedRectangleBorder(
//                   borderRadius: BorderRadius.circular(14),
//                 ),
//               ),
//               child:
//                   _loading
//                       ? const SizedBox(
//                         height: 24,
//                         width: 24,
//                         child: CircularProgressIndicator(
//                           color: Colors.white,
//                           strokeWidth: 3,
//                         ),
//                       )
//                       : const Text(
//                         "Verify & Continue",
//                         style: TextStyle(
//                           fontSize: 18,
//                           fontWeight: FontWeight.bold,
//                         ),
//                       ),
//             ),

//             const Spacer(),

//             // Resend OTP
//             Row(
//               mainAxisAlignment: MainAxisAlignment.center,
//               children: [
//                 Text(
//                   "Didn't receive the code? ",
//                   style: TextStyle(color: Colors.grey[700]),
//                 ),
//                 TextButton(
//                   onPressed: _resendCountdown == 0 ? _resendOtp : null,
//                   child: Text(
//                     _resendCountdown == 0
//                         ? "Resend"
//                         : "Resend in $_resendCountdown s",
//                     style: TextStyle(
//                       color:
//                           _resendCountdown == 0
//                               ? _primaryColor
//                               : Colors.grey.shade500,
//                       fontWeight: FontWeight.bold,
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_otp_text_field/flutter_otp_text_field.dart';
import 'RideBookingScreen.dart';
import 'profile_add_screen.dart';

class OtpVerifyScreen extends StatefulWidget {
  final String phone;
  final String token;

  const OtpVerifyScreen({Key? key, required this.phone, required this.token})
    : super(key: key);

  @override
  State<OtpVerifyScreen> createState() => _OtpVerifyScreenState();
}

class _OtpVerifyScreenState extends State<OtpVerifyScreen> {
  String _otp = "";
  bool _loading = false;
  bool _showError = false;
  int _resendCountdown = 30;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _startResendTimer();
  }

  void _startResendTimer() {
    _resendCountdown = 30;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendCountdown == 0) {
        timer.cancel();
      } else {
        setState(() => _resendCountdown--);
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  Future<void> _verifyOtp() async {
    if (_otp != "12345") {
      setState(() {
        _showError = true;
      });
      HapticFeedback.vibrate();
      return;
    }

    setState(() {
      _loading = true;
      _showError = false;
    });

    await Future.delayed(const Duration(seconds: 1)); // simulate API delay

    setState(() => _loading = false);

    if (widget.phone == "+251945989369") {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const RideBookingScreen()),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder:
              (_) => ProfileAddScreen(token: widget.token, phone: widget.phone),
        ),
      );
    }
  }

  void _resendOtp() {
    if (_resendCountdown == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text("OTP resent"),
          backgroundColor: Theme.of(context).primaryColor,
        ),
      );
      _startResendTimer();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      appBar: AppBar(
        title: const Text("OTP Verification"),
        backgroundColor: theme.primaryColor,
        elevation: 0,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(Icons.lock_outline, size: 80, color: theme.primaryColor),
            const SizedBox(height: 20),
            Text(
              "Enter the 5-digit code sent to",
              style: theme.textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              widget.phone,
              style: theme.textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),

            // OTP Input
            OtpTextField(
              numberOfFields: 5,
              borderColor: Colors.grey.shade400,
              focusedBorderColor: theme.primaryColor,
              showFieldAsBox: true,
              borderWidth: 2,
              fieldWidth: 50,
              borderRadius: BorderRadius.circular(12),
              keyboardType: TextInputType.number,
              onCodeChanged: (code) {
                setState(() {
                  _otp = code;
                  _showError = false;
                });
              },
              onSubmit: (code) {
                _otp = code;
                if (!_loading) _verifyOtp();
              },
            ),

            if (_showError)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Text(
                  "Invalid OTP, please try again.",
                  style: TextStyle(color: theme.colorScheme.error),
                ),
              ),

            const SizedBox(height: 30),

            // Verify Button
            ElevatedButton(
              onPressed: _otp.length == 5 && !_loading ? _verifyOtp : null,
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    _otp.length == 5 && !_loading
                        ? theme.primaryColor
                        : Colors.grey.shade400,
                minimumSize: const Size.fromHeight(50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child:
                  _loading
                      ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 3,
                        ),
                      )
                      : const Text(
                        "Verify & Continue",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
            ),

            const Spacer(),

            // Resend OTP
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "Didn't receive the code? ",
                  style: theme.textTheme.bodyMedium,
                ),
                TextButton(
                  onPressed: _resendCountdown == 0 ? _resendOtp : null,
                  child: Text(
                    _resendCountdown == 0
                        ? "Resend"
                        : "Resend in $_resendCountdown s",
                    style: TextStyle(
                      color:
                          _resendCountdown == 0
                              ? theme.primaryColor
                              : Colors.grey.shade500,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
