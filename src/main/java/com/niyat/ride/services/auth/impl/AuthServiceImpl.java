package com.niyat.ride.services.auth.impl;

import com.niyat.ride.dtos.auth.*;
import com.niyat.ride.dtos.response.ApiResponseDTO;
import com.niyat.ride.dtos.response.UserResponseDTO;
import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import com.niyat.ride.models.Driver;
import com.niyat.ride.models.Passenger;
import com.niyat.ride.models.Session;
import com.niyat.ride.models.User;
import com.niyat.ride.repositories.DriverRepository;
import com.niyat.ride.repositories.PassengerRepository;
import com.niyat.ride.repositories.SessionRepository;
import com.niyat.ride.services.auth.AuthService;
import com.niyat.ride.utils.file.BaseFileProcessor;
import com.niyat.ride.utils.jwt.JwtTokenProvider;
import com.niyat.ride.utils.otp.OtpUtil;
import com.niyat.ride.utils.sms.SmsUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final PassengerRepository passengerRepository;
    private final DriverRepository driverRepository;
    private final SessionRepository sessionRepository;
    private final OtpUtil otpUtil;
    private final SmsUtil smsUtil;
    private final JwtTokenProvider jwtTokenProvider;
    private final BaseFileProcessor baseFileProcessor;

    @Value("${jwt.refresh-token-expiration-ms}")
    private long refreshTokenValidityMs;
    
    @Override
    @Transactional
    public ApiResponseDTO<UserResponseDTO> registerPassenger(PassengerRegistrationDTO registrationDTO) {
        try {
            // Check if passenger already exists
            if (passengerRepository.existsByPhoneNumber(registrationDTO.getPhoneNumber())) {
                return ApiResponseDTO.error("User with this phone number already exists");
            }
            
            // Create new passenger
            Passenger passenger = new Passenger();
            passenger.setName(registrationDTO.getName());
            passenger.setPhoneNumber(registrationDTO.getPhoneNumber());
            passenger.setRole(Role.PASSENGER);
            passenger.setStatus(AccountStatus.PENDING);
            passenger.setIsVerified(false);
            passenger.setIsOtpSent(false);
            
            // Generate and send OTP
            String otp = otpUtil.generateOtp();
            passenger.setOtp(otp);
            passenger.setIsOtpSent(true);
            
            Passenger savedPassenger = passengerRepository.save(passenger);
            
            // Send OTP via SMS
            boolean smsSent = smsUtil.sendOtp(registrationDTO.getPhoneNumber(), otp);
            if (!smsSent) {
                log.warn("Failed to send OTP to {}", registrationDTO.getPhoneNumber());
            }
            
            UserResponseDTO response = mapToUserResponse(savedPassenger);
            log.info("Passenger registered: phone={}, role_entity={}, role_response={}, isVerified={}, status={}",
                    savedPassenger.getPhoneNumber(), savedPassenger.getRole(), response.getRole(),
                    response.getIsVerified(), response.getStatus());
            return ApiResponseDTO.success("Registration successful. Please verify your phone number with the OTP sent.", response);
            
        } catch (Exception e) {
            log.error("Error during passenger registration: {}", e.getMessage(), e);
            return ApiResponseDTO.error("Registration failed. Please try again.");
        }
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<UserResponseDTO> registerDriver(DriverRegistrationDTO registrationDTO) {
        try {
            // Check if driver already exists
            if (driverRepository.existsByPhoneNumber(registrationDTO.getPhoneNumber())) {
                return ApiResponseDTO.error("User with this phone number already exists");
            }
            
            // Check if license number already exists
            if (driverRepository.existsByLicenseNumber(registrationDTO.getLicenseNumber())) {
                return ApiResponseDTO.error("Driver with this license number already exists");
            }
            
            // Check if plate number already exists
            if (driverRepository.existsByPlateNumber(registrationDTO.getPlateNumber())) {
                return ApiResponseDTO.error("Vehicle with this plate number already exists");
            }
            
            // Create new driver
            Driver driver = new Driver();
            driver.setName(registrationDTO.getName());
            driver.setPhoneNumber(registrationDTO.getPhoneNumber());
            driver.setRole(Role.DRIVER);
            driver.setStatus(AccountStatus.PENDING);
            driver.setIsVerified(false);
            driver.setIsOtpSent(false);
            driver.setLicenseNumber(registrationDTO.getLicenseNumber());
            driver.setPlateNumber(registrationDTO.getPlateNumber());
            driver.setVehicleType(registrationDTO.getVehicleType());
            driver.setVehicleColor(registrationDTO.getVehicleColor());

            // Save required files and set paths
            if (registrationDTO.getLicenseImage() == null || registrationDTO.getVehicleRegistrationDocument() == null) {
                return ApiResponseDTO.error("Both licenseImage and vehicleRegistrationDocument are required");
            }
            try {
                String licensePath = baseFileProcessor.saveSingle(registrationDTO.getLicenseImage(), "drivers/licenses");
                String vehicleDocPath = baseFileProcessor.saveSingle(registrationDTO.getVehicleRegistrationDocument(), "drivers/vehicle_docs");
                driver.setLicenseImagePath(licensePath);
                driver.setVehicleRegistrationDocPath(vehicleDocPath);
            } catch (IllegalArgumentException iae) {
                return ApiResponseDTO.error(iae.getMessage());
            }
            
            // Generate and send OTP
            String otp = otpUtil.generateOtp();
            driver.setOtp(otp);
            driver.setIsOtpSent(true);
            
            Driver savedDriver = driverRepository.save(driver);
            
            // Send OTP via SMS
            boolean smsSent = smsUtil.sendOtp(registrationDTO.getPhoneNumber(), otp);
            if (!smsSent) {
                log.warn("Failed to send OTP to {}", registrationDTO.getPhoneNumber());
            }
            
            UserResponseDTO response = mapToUserResponse(savedDriver);
            log.info("Driver registered: phone={}, role_entity={}, role_response={}, isVerified={}, status={}",
                    savedDriver.getPhoneNumber(), savedDriver.getRole(), response.getRole(),
                    response.getIsVerified(), response.getStatus());
            return ApiResponseDTO.success("Driver registration successful. Please verify your phone number with the OTP sent. Admin approval required after verification.", response);
            
        } catch (Exception e) {
            log.error("Error during driver registration: {}", e.getMessage(), e);
            return ApiResponseDTO.error("Registration failed. Please try again.");
        }
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<AuthResponseDTO> verifyOtp(OtpVerificationDTO verificationDTO) {
        try {
            // Find user by phone number
            Optional<User> userOpt = findUserByPhoneNumber(verificationDTO.getPhoneNumber());
            if (userOpt.isEmpty()) {
                return ApiResponseDTO.error("User not found");
            }
            
            User user = userOpt.get();
            
            // Validate OTP
            if (!otpUtil.validateOtp(verificationDTO.getOtp(), user.getOtp())) {
                return ApiResponseDTO.error("Invalid OTP");
            }
            
            // Update user verification status
            user.setIsVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
            user.setOtp(null); // Clear OTP after successful verification
            user.setIsOtpSent(false);
            
            // Set status based on role
            if (user.getRole() == Role.PASSENGER) {
                user.setStatus(AccountStatus.ACTIVE);
            } else if (user.getRole() == Role.DRIVER) {
                user.setStatus(AccountStatus.PENDING); // Requires admin approval
            }
            
            User savedUser = saveUser(user);

            // Generate tokens
            String username = savedUser.getPhoneNumber();
            String accessToken = jwtTokenProvider.generateAccessToken(username);
            String refreshToken = jwtTokenProvider.generateRefreshToken(username);

            // Persist refresh token session
            Session session = Session.builder()
                    .user(savedUser)
                    .refreshToken(refreshToken)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusNanos(refreshTokenValidityMs * 1_000_000))
                    .build();
            sessionRepository.save(session);

            UserResponseDTO userDto = mapToUserResponse(savedUser);
            AuthResponseDTO response = new AuthResponseDTO(userDto, accessToken, refreshToken);
            String message = user.getRole() == Role.DRIVER 
                ? "Phone number verified successfully. Your account is pending admin approval."
                : "Phone number verified successfully. Your account is now active.";
                
            return ApiResponseDTO.success(message, response);
            
        } catch (Exception e) {
            log.error("Error during OTP verification: {}", e.getMessage(), e);
            return ApiResponseDTO.error("Verification failed. Please try again.");
        }
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<String> generateLoginOtp(LoginRequestDTO loginRequestDTO) {
        try {
            // Find user by phone number
            Optional<User> userOpt = findUserByPhoneNumber(loginRequestDTO.getPhoneNumber());
            if (userOpt.isEmpty()) {
                return ApiResponseDTO.error("User not found with this phone number");
            }
            
            User user = userOpt.get();
            
            // Check if user is verified
            if (!user.getIsVerified()) {
                return ApiResponseDTO.error("Please verify your phone number first");
            }
            
            // Check if user account is active
            if (user.getStatus() != AccountStatus.ACTIVE) {
                return ApiResponseDTO.error("Your account is not active. Please contact support.");
            }
            
            // Generate new OTP for login
            String otp = otpUtil.generateOtp();
            user.setOtp(otp);
            user.setIsOtpSent(true);
            
            saveUser(user);
            
            // Send OTP via SMS
            boolean smsSent = smsUtil.sendOtp(loginRequestDTO.getPhoneNumber(), otp);
            if (!smsSent) {
                log.warn("Failed to send login OTP to {}", loginRequestDTO.getPhoneNumber());
                return ApiResponseDTO.error("Failed to send OTP. Please try again.");
            }
            
            return ApiResponseDTO.success("Login OTP sent successfully");
            
        } catch (Exception e) {
            log.error("Error generating login OTP: {}", e.getMessage(), e);
            return ApiResponseDTO.error("Failed to generate login OTP. Please try again.");
        }
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<AuthResponseDTO> loginWithOtp(OtpVerificationDTO verificationDTO) {
        try {
            // Find user by phone number
            Optional<User> userOpt = findUserByPhoneNumber(verificationDTO.getPhoneNumber());
            if (userOpt.isEmpty()) {
                return ApiResponseDTO.error("User not found");
            }
            
            User user = userOpt.get();
            
            // Check if user is verified
            if (!user.getIsVerified()) {
                return ApiResponseDTO.error("Please verify your phone number first");
            }
            
            // Check if user account is active
            if (user.getStatus() != AccountStatus.ACTIVE) {
                return ApiResponseDTO.error("Your account is not active. Please contact support.");
            }
            
            // Validate OTP
            if (!otpUtil.validateOtp(verificationDTO.getOtp(), user.getOtp())) {
                return ApiResponseDTO.error("Invalid OTP");
            }
            
            // Clear OTP after successful login
            user.setOtp(null);
            user.setIsOtpSent(false);
            saveUser(user);

            // Generate tokens
            String username = user.getPhoneNumber();
            String accessToken = jwtTokenProvider.generateAccessToken(username);
            String refreshToken = jwtTokenProvider.generateRefreshToken(username);

            // Persist refresh token session
            Session session = Session.builder()
                    .user(user)
                    .refreshToken(refreshToken)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusNanos(refreshTokenValidityMs * 1_000_000))
                    .build();
            sessionRepository.save(session);

            UserResponseDTO userDto = mapToUserResponse(user);
            AuthResponseDTO response = new AuthResponseDTO(userDto, accessToken, refreshToken);
            return ApiResponseDTO.success("Login successful", response);
            
        } catch (Exception e) {
            log.error("Error during login: {}", e.getMessage(), e);
            return ApiResponseDTO.error("Login failed. Please try again.");
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<AccessTokenResponseDTO> refresh(TokenRefreshRequestDTO requestDTO) {
        String refreshToken = requestDTO.getRefreshToken();
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            return ApiResponseDTO.error("Invalid refresh token");
        }

        Optional<Session> sessionOpt = sessionRepository.findByRefreshToken(refreshToken);
        if (sessionOpt.isEmpty()) {
            return ApiResponseDTO.error("Refresh token not recognized");
        }

        Session session = sessionOpt.get();
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ApiResponseDTO.error("Refresh token expired");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        String newAccess = jwtTokenProvider.generateAccessToken(username);
        return ApiResponseDTO.success("Token refreshed", new AccessTokenResponseDTO(newAccess));
    }

    @Override
    @Transactional
    public ApiResponseDTO<String> logout(TokenRefreshRequestDTO requestDTO) {
        String refreshToken = requestDTO.getRefreshToken();
        sessionRepository.deleteByRefreshToken(refreshToken);
        return ApiResponseDTO.success("Logged out successfully");
    }

    // Helper methods
    
    private Optional<User> findUserByPhoneNumber(String phoneNumber) {
        Optional<Passenger> passenger = passengerRepository.findByPhoneNumber(phoneNumber);
        if (passenger.isPresent()) {
            return Optional.of(passenger.get());
        }
        
        Optional<Driver> driver = driverRepository.findByPhoneNumber(phoneNumber);
        return driver.map(d -> (User) d);
    }
    
    private User saveUser(User user) {
        if (user instanceof Passenger) {
            return passengerRepository.save((Passenger) user);
        } else if (user instanceof Driver) {
            return driverRepository.save((Driver) user);
        }
        throw new IllegalArgumentException("Unknown user type");
    }
    
    private UserResponseDTO mapToUserResponse(User user) {
        UserResponseDTO response = new UserResponseDTO();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setEmail(user.getEmail());
        response.setProfilePicture(user.getProfilePicture());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        response.setIsVerified(user.getIsVerified());
        response.setVerifiedAt(user.getVerifiedAt());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}
