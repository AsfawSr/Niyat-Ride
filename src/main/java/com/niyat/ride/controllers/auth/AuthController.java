package com.niyat.ride.controllers.auth;

import com.niyat.ride.dtos.auth.*;
import com.niyat.ride.dtos.response.ApiResponseDTO;
import com.niyat.ride.dtos.response.UserResponseDTO;
import com.niyat.ride.services.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "OTP-based authentication endpoints")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/passenger/register")
    @Operation(
            summary = "Register a new passenger",
            description = "Register a new passenger with name and phone number. OTP will be sent for verification.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Registration successful"),
                    @ApiResponse(responseCode = "400", description = "Validation error or user already exists"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> registerPassenger(
            @Valid @RequestBody PassengerRegistrationDTO registrationDTO) {
        
        ApiResponseDTO<UserResponseDTO> response = authService.registerPassenger(registrationDTO);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping(value = "/driver/register", consumes = {"multipart/form-data"})
    @Operation(
            summary = "Register a new driver",
            description = "Register a new driver with personal and vehicle details. OTP will be sent for verification.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Registration successful"),
                    @ApiResponse(responseCode = "400", description = "Validation error or driver/vehicle already exists"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @RequestBody(
            required = true,
            content = @Content(mediaType = "multipart/form-data",
                    schema = @Schema(implementation = DriverRegistrationDTO.class))
    )
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> registerDriver(
            @Valid @ModelAttribute DriverRegistrationDTO registrationDTO) {
        
        ApiResponseDTO<UserResponseDTO> response = authService.registerDriver(registrationDTO);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify-otp")
    @Operation(
            summary = "Verify OTP",
            description = "Verify the OTP sent to user's phone number during registration.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OTP verification successful"),
                    @ApiResponse(responseCode = "400", description = "Invalid OTP or user not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<ApiResponseDTO<AuthResponseDTO>> verifyOtp(
            @Valid @RequestBody OtpVerificationDTO verificationDTO) {
        
        ApiResponseDTO<AuthResponseDTO> response = authService.verifyOtp(verificationDTO);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/generate-login-otp")
    @Operation(
            summary = "Generate OTP for login",
            description = "Generate and send OTP to user's phone number for login.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
                    @ApiResponse(responseCode = "400", description = "User not found or not verified"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<ApiResponseDTO<String>> generateLoginOtp(
            @Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        
        ApiResponseDTO<String> response = authService.generateLoginOtp(loginRequestDTO);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    @Operation(
            summary = "Login with phone number and OTP",
            description = "Login using phone number and OTP verification.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login successful"),
                    @ApiResponse(responseCode = "400", description = "Invalid credentials or user not verified"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<ApiResponseDTO<AuthResponseDTO>> loginWithOtp(
            @Valid @RequestBody OtpVerificationDTO verificationDTO) {
        
        ApiResponseDTO<AuthResponseDTO> response = authService.loginWithOtp(verificationDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(
            summary = "Refresh access token",
            description = "Provide a valid refresh token to receive a new access token.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Token refreshed"),
                    @ApiResponse(responseCode = "400", description = "Invalid or expired refresh token")
            }
    )
    public ResponseEntity<ApiResponseDTO<AccessTokenResponseDTO>> refresh(
            @Valid @RequestBody TokenRefreshRequestDTO requestDTO) {
        ApiResponseDTO<AccessTokenResponseDTO> response = authService.refresh(requestDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Logout",
            description = "Invalidate the provided refresh token.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Logged out successfully")
            }
    )
    public ResponseEntity<ApiResponseDTO<String>> logout(
            @Valid @RequestBody TokenRefreshRequestDTO requestDTO) {
        ApiResponseDTO<String> response = authService.logout(requestDTO);
        return ResponseEntity.ok(response);
    }
}
