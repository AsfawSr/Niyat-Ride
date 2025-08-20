import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/phone_register_screen.dart';

void main() {
  AppTheme.configureSystemUI(); // Light by default
  runApp(const NyatApp());
}

class NyatApp extends StatelessWidget {
  const NyatApp({Key? key}) : super(key: key);

  // Global dark mode notifier
  static final ValueNotifier<bool> isDarkMode = ValueNotifier(false);

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: isDarkMode,
      builder: (_, darkMode, __) {
        return MaterialApp(
          title: "Nyat Passenger",
          debugShowCheckedModeBanner: false,
          theme: darkMode ? ThemeData.dark() : AppTheme.light(),
          home: OnboardingScreen(),
        );
      },
    );
  }
}

class OnboardingScreen extends StatefulWidget {
  @override
  _OnboardingScreenState createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<Map<String, String>> onboardingData = [
    {
      "title": "Anywhere you are",
      "subtitle":
          "Book a ride quickly and easily, wherever you are. Our drivers are always close by.",
      "image": "assets/images/onboard1.png",
    },
    {
      "title": "At anytime",
      "subtitle":
          "Day or night, our ride-hailing service is available 24/7 to take you where you need to go.",
      "image": "assets/images/onboard2.png",
    },
    {
      "title": "Book your car",
      "subtitle":
          "Choose your pickup and dropoff, confirm, and your ride will be on the way in minutes.",
      "image": "assets/images/onboard3.png",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            PageView.builder(
              controller: _pageController,
              itemCount: onboardingData.length,
              onPageChanged: (index) {
                setState(() {
                  _currentIndex = index;
                });
              },
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const SizedBox(height: 60),
                      Image.asset(
                        onboardingData[index]['image']!,
                        height: 250,
                        fit: BoxFit.contain,
                      ),
                      const SizedBox(height: 20),
                      Text(
                        onboardingData[index]['title']!,
                        style: theme.textTheme.titleLarge, // use theme
                      ),
                      const SizedBox(height: 10),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 25.0),
                        child: Text(
                          onboardingData[index]['subtitle']!,
                          textAlign: TextAlign.center,
                          style: theme.textTheme.bodyMedium, // use theme
                        ),
                      ),
                      const SizedBox(height: 40),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          onboardingData.length,
                          (dotIndex) => AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            height: 8,
                            width: _currentIndex == dotIndex ? 24 : 8,
                            decoration: BoxDecoration(
                              color:
                                  _currentIndex == dotIndex
                                      ? theme
                                          .colorScheme
                                          .primary // from AppTheme
                                      : Colors.grey.shade400,
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 80),
                    ],
                  ),
                );
              },
            ),

            /// Show "Skip" only if NOT on last page
            if (_currentIndex < onboardingData.length - 1)
              Positioned(
                top: 15,
                right: 20,
                child: TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PhoneRegisterScreen(),
                      ),
                    );
                  },
                  child: Text(
                    "Skip",
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onBackground,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),

            /// Image button (bottom center)
            Positioned(
              bottom: 30,
              left: 0,
              right: 0,
              child: Center(
                child: GestureDetector(
                  onTap: () {
                    if (_currentIndex < onboardingData.length - 1) {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 400),
                        curve: Curves.easeInOut,
                      );
                    } else {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const PhoneRegisterScreen(),
                        ),
                      );
                    }
                  },
                  child: Container(
                    height: 70,
                    width: 70,
                    decoration: const BoxDecoration(shape: BoxShape.circle),
                    child: Center(
                      child:
                          _currentIndex == onboardingData.length - 1
                              ? Image.asset(
                                "assets/images/final.png",
                                height: 60,
                                width: 60,
                              )
                              : Image.asset(
                                _currentIndex == 0
                                    ? "assets/images/first.png"
                                    : "assets/images/second.png",
                                height: 60,
                                width: 60,
                              ),
                    ),
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
