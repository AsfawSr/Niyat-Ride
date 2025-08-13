package com.niyat.ride.services.auth;

import com.niyat.ride.dtos.auth.*;
import com.niyat.ride.dtos.response.ApiResponseDTO;
import com.niyat.ride.dtos.response.UserResponseDTO;

public interface AuthService {
    
    /**
     * Register a new passenger with name and phone number
     * Sets status to PENDING and generates OTP
     */
    ApiResponseDTO<UserResponseDTO> registerPassenger(PassengerRegistrationDTO registrationDTO);
    
    /**
     * Register a new driver with personal and vehicle details
     * Sets status to PENDING and generates OTP
     */
    ApiResponseDTO<UserResponseDTO> registerDriver(DriverRegistrationDTO registrationDTO);
    
    /**
     * Verify OTP for user registration
     * If successful, sets status to ACTIVE for passengers, PENDING for drivers (admin approval needed)
     */
    ApiResponseDTO<AuthResponseDTO> verifyOtp(OtpVerificationDTO verificationDTO);
    
    /**
     * Generate and send OTP for login
     */
    ApiResponseDTO<String> generateLoginOtp(LoginRequestDTO loginRequestDTO);
    
    /**
     * Verify OTP and login user
     */
    ApiResponseDTO<AuthResponseDTO> loginWithOtp(OtpVerificationDTO verificationDTO);

    /**
     * Refresh access token using a valid refresh token
     */
    ApiResponseDTO<AccessTokenResponseDTO> refresh(TokenRefreshRequestDTO requestDTO);

    /**
     * Logout by invalidating refresh token
     */
    ApiResponseDTO<String> logout(TokenRefreshRequestDTO requestDTO);
}
