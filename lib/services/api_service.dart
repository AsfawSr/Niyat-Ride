import 'dart:async';
import '../models/user.dart';

class ApiService {
  /// Simulate sending OTP — always succeed after 1 second delay.
  static Future<bool> sendOtp(String phone) async {
    await Future.delayed(const Duration(seconds: 1));
    return true; // always success
  }

  /// Simulate verifying OTP — always succeed and return dummy user data after 1 second delay.
  /// Returns null if OTP code is invalid (e.g. not '1234') to simulate failure.
  static Future<Map<String, dynamic>?> verifyOtp(
    String phone,
    String code,
  ) async {
    await Future.delayed(const Duration(seconds: 1));

    // Simulate failure if OTP is not '1234'
    if (code != '1234') return null;

    // Dummy user data example — adjust as per your app's needs
    return {
      "userId": "12345",
      "phone": phone,
      "token": "dummy-jwt-token",
      "name": "Test User",
    };
  }

  /// Simulate updating user profile — always succeed after 1 second delay.
  static Future<bool> updateProfile(String token, UserModel user) async {
    await Future.delayed(const Duration(seconds: 1));
    return true; // always success
  }
}
