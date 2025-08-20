import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  String? _token;
  bool _loading = false;

  UserModel? get user => _user;
  String? get token => _token;
  bool get loading => _loading;
  bool get isAuthenticated => _token != null;

  Future<bool> sendOtp(String phone) async {
    _loading = true;
    notifyListeners();
    final ok = await ApiService.sendOtp(phone);
    _loading = false;
    notifyListeners();
    return ok;
  }

  Future<bool> verifyOtp(String phone, String code) async {
    _loading = true;
    notifyListeners();
    final data = await ApiService.verifyOtp(phone, code);
    _loading = false;
    if (data != null) {
      _token = data['token'];
      _user = UserModel.fromJson(data['user']);
      notifyListeners();
      return true;
    }
    notifyListeners();
    return false;
  }

  Future<bool> updateProfile(UserModel updatedUser) async {
    if (_token == null) return false;
    _loading = true;
    notifyListeners();
    final ok = await ApiService.updateProfile(_token!, updatedUser);
    if (ok) {
      _user = updatedUser;
    }
    _loading = false;
    notifyListeners();
    return ok;
  }
}
