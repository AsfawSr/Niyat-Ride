class UserModel {
  final String phone;
  String? firstName;
  String? lastName;
  String? email;

  UserModel({
    required this.phone,
    this.firstName,
    this.lastName,
    this.email,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      phone: json['phone'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      email: json['email'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'phone': phone,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
    };
  }
}
