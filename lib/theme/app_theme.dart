// import 'package:flutter/material.dart';

// class AppTheme {
//   // Primary color from your Figma (green: #08B783)
//   static const Color _primaryColor = Color(0xFF08B783);

//   // Choose a compatible secondary color (darker green shade)
//   static const Color _secondaryColor = Color(0xFF056B4C);

//   // Accent color that complements the palette (lighter green / teal tone)
//   static const Color _accentColor = Color(0xFF4DD6A2);

//   static ThemeData light() {
//     return ThemeData(
//       primaryColor: _primaryColor,
//       colorScheme: ColorScheme.light(
//         primary: _primaryColor,
//         secondary: _secondaryColor,
//         surface: Colors.white,
//         background: Colors.grey[50]!,
//         error: Colors.red[700]!,
//         onPrimary: Colors.white,
//         onSecondary: Colors.white,
//         onSurface: Colors.black,
//         onBackground: Colors.black,
//         onError: Colors.white,
//         brightness: Brightness.light,
//       ),
//       appBarTheme: const AppBarTheme(
//         backgroundColor: _primaryColor,
//         foregroundColor: Colors.white,
//         elevation: 0,
//         centerTitle: true,
//         titleTextStyle: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
//       ),
//       elevatedButtonTheme: ElevatedButtonThemeData(
//         style: ElevatedButton.styleFrom(
//           backgroundColor: _primaryColor,
//           foregroundColor: Colors.white,
//           disabledBackgroundColor: Colors.grey[400],
//           disabledForegroundColor: Colors.white,
//           shape: RoundedRectangleBorder(
//             borderRadius: BorderRadius.circular(12),
//           ),
//           padding: const EdgeInsets.symmetric(vertical: 16),
//           textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//           elevation: 3,
//           shadowColor: _primaryColor.withOpacity(0.3),
//         ),
//       ),
//       inputDecorationTheme: InputDecorationTheme(
//         border: OutlineInputBorder(
//           borderRadius: BorderRadius.circular(8),
//           borderSide: BorderSide(color: Colors.grey[400]!),
//         ),
//         enabledBorder: OutlineInputBorder(
//           borderRadius: BorderRadius.circular(8),
//           borderSide: BorderSide(color: Colors.grey[400]!),
//         ),
//         focusedBorder: OutlineInputBorder(
//           borderRadius: BorderRadius.circular(8),
//           borderSide: const BorderSide(color: _primaryColor, width: 1.5),
//         ),
//         contentPadding: const EdgeInsets.symmetric(
//           horizontal: 16,
//           vertical: 16,
//         ),
//         hintStyle: TextStyle(color: Colors.grey[500]),
//       ),
//       checkboxTheme: CheckboxThemeData(
//         fillColor: MaterialStateProperty.resolveWith<Color>((states) {
//           if (states.contains(MaterialState.selected)) {
//             return _primaryColor;
//           }
//           return Colors.grey[400]!;
//         }),
//         shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
//       ),
//       textTheme: const TextTheme(
//         titleLarge: TextStyle(
//           fontSize: 22,
//           fontWeight: FontWeight.bold,
//           color: _primaryColor,
//         ),
//         bodyLarge: TextStyle(fontSize: 16, color: Colors.black87),
//         bodyMedium: TextStyle(fontSize: 14, color: Colors.grey),
//         labelLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//       ),
//       textButtonTheme: TextButtonThemeData(
//         style: TextButton.styleFrom(
//           foregroundColor: _primaryColor,
//           textStyle: const TextStyle(
//             decoration: TextDecoration.underline,
//             fontWeight: FontWeight.bold,
//           ),
//         ),
//       ),
//       cardTheme: CardTheme(
//         elevation: 2,
//         shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//         margin: EdgeInsets.zero,
//       ),
//     );
//   }
// // }
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';

// class AppTheme {
//   // Primary color from your Figma (green: #08B783)
//   static const Color _primaryColor = Color(0xFF08B783);

//   // Secondary color (darker green shade)
//   static const Color _secondaryColor = Color(0xFF056B4C);

//   // Accent color (lighter green / teal tone)
//   static const Color _accentColor = Color(0xFF4DD6A2);

//   /// Call this in `main()` before runApp()
//   static void configureSystemUI({bool isDark = false}) {
//     SystemChrome.setSystemUIOverlayStyle(
//       SystemUiOverlayStyle(
//         statusBarColor: Colors.transparent, // transparent background
//         statusBarIconBrightness:
//             isDark ? Brightness.light : Brightness.dark, // icon color
//         systemNavigationBarColor: isDark ? Colors.black : Colors.white,
//         systemNavigationBarIconBrightness:
//             isDark ? Brightness.light : Brightness.dark,
//       ),
//     );
//   }

//   /// Light Theme
//   static ThemeData light() {
//     return ThemeData(
//       brightness: Brightness.light,
//       primaryColor: _primaryColor,
//       colorScheme: ColorScheme.light(
//         primary: _primaryColor,
//         secondary: _secondaryColor,
//         surface: Colors.white,
//         background: Colors.grey[50]!,
//         error: Colors.red[700]!,
//         onPrimary: Colors.white,
//         onSecondary: Colors.white,
//         onSurface: Colors.black,
//         onBackground: Colors.black,
//         onError: Colors.white,
//       ),
//       appBarTheme: const AppBarTheme(
//         backgroundColor: _primaryColor,
//         foregroundColor: Colors.white,
//         elevation: 0,
//         centerTitle: true,
//         titleTextStyle: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
//         systemOverlayStyle: SystemUiOverlayStyle(
//           statusBarColor: _primaryColor,
//           statusBarIconBrightness: Brightness.light,
//         ),
//       ),
//       textTheme: const TextTheme(
//         titleLarge: TextStyle(
//           fontSize: 22,
//           fontWeight: FontWeight.bold,
//           color: _primaryColor,
//         ),
//         bodyLarge: TextStyle(fontSize: 16, color: Colors.black87),
//         bodyMedium: TextStyle(fontSize: 14, color: Colors.grey),
//         labelLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//       ),
//     );
//   }

//   /// Dark Theme
//   static ThemeData dark() {
//     return ThemeData(
//       brightness: Brightness.dark,
//       primaryColor: _primaryColor,
//       colorScheme: ColorScheme.dark(
//         primary: _primaryColor,
//         secondary: _secondaryColor,
//         surface: Colors.grey[900]!,
//         background: Colors.black,
//         error: Colors.red[400]!,
//         onPrimary: Colors.white,
//         onSecondary: Colors.white,
//         onSurface: Colors.white,
//         onBackground: Colors.white,
//         onError: Colors.black,
//       ),
//       appBarTheme: const AppBarTheme(
//         backgroundColor: Colors.black,
//         foregroundColor: Colors.white,
//         elevation: 0,
//         centerTitle: true,
//         titleTextStyle: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
//         systemOverlayStyle: SystemUiOverlayStyle(
//           statusBarColor: Colors.black,
//           statusBarIconBrightness: Brightness.light,
//         ),
//       ),
//       textTheme: const TextTheme(
//         titleLarge: TextStyle(
//           fontSize: 22,
//           fontWeight: FontWeight.bold,
//           color: Colors.white,
//         ),
//         bodyLarge: TextStyle(fontSize: 16, color: Colors.white70),
//         bodyMedium: TextStyle(fontSize: 14, color: Colors.grey),
//         labelLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppTheme {
  static const Color _primaryColor = Color(0xFF08B783);
  static const Color _secondaryColor = Color(0xFF056B4C);
  static const Color _accentColor = Color(0xFF4DD6A2);

  static void configureSystemUI({bool isDark = false}) {
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
        systemNavigationBarColor: isDark ? Colors.black : Colors.white,
        systemNavigationBarIconBrightness:
            isDark ? Brightness.light : Brightness.dark,
      ),
    );
  }

  static ThemeData light() {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: _primaryColor,
      colorScheme: ColorScheme.light(
        primary: _primaryColor,
        secondary: _secondaryColor,
        surface: Colors.white,
        background: Colors.grey[50]!,
        error: Colors.red[700]!,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: Colors.black,
        onBackground: Colors.black,
        onError: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: _primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          fontFamily: 'NotoSansEthiopic',
        ),
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: _primaryColor,
          statusBarIconBrightness: Brightness.light,
        ),
      ),
      textTheme: const TextTheme(
        titleLarge: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: _primaryColor,
          fontFamily: 'NotoSansEthiopic',
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          color: Colors.black87,
          fontFamily: 'NotoSansEthiopic',
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          color: Colors.grey,
          fontFamily: 'NotoSansEthiopic',
        ),
        labelLarge: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          fontFamily: 'NotoSansEthiopic',
        ),
      ),
    );
  }

  static ThemeData dark() {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: _primaryColor,
      scaffoldBackgroundColor: Colors.black,
      colorScheme: ColorScheme.dark(
        primary: _primaryColor,
        secondary: _accentColor,
        surface: Colors.grey[850]!, // slightly lighter than pure black
        background: Colors.black,
        error: Colors.red[400]!,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: Colors.white70, // readable text on dark surfaces
        onBackground: Colors.white70,
        onError: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          fontFamily: 'NotoSansEthiopic',
        ),
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.black,
          statusBarIconBrightness: Brightness.light,
        ),
      ),
      textTheme: const TextTheme(
        titleLarge: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: Colors.white,
          fontFamily: 'NotoSansEthiopic',
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          color: Colors.white70, // slightly dimmed white for reading comfort
          fontFamily: 'NotoSansEthiopic',
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          color: Colors.white60, // more contrast than grey
          fontFamily: 'NotoSansEthiopic',
        ),
        labelLarge: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.white, // ensure labels are visible
          fontFamily: 'NotoSansEthiopic',
        ),
      ),
      iconTheme: const IconThemeData(
        color: Colors.white70, // default icon color on dark mode
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: _primaryColor, // keeps button green
          foregroundColor: Colors.white, // button text
        ),
      ),
      cardColor: Colors.grey[850], // for panels, bottom sheets
      dividerColor: Colors.grey[700],
    );
  }
}
