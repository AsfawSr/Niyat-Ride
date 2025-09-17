package com.niyat.ride.user.controllers;
import com.niyat.ride.user.dtos.VerifyOtpResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.niyat.ride.user.dtos.DriverResponseDTO;
import com.niyat.ride.user.dtos.DriverSignupDTO;
import com.niyat.ride.user.dtos.DriverUpdateDTO;
import com.niyat.ride.user.services.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/driver-auth")
@RequiredArgsConstructor
public class DriverAuthController {

    private final DriverService driverService;


//    first request otp after user enters phone number
    @PostMapping("/request-otp")
    @Operation(summary = "Request OTP for driver Authentication")
    public ResponseEntity<String> requestAuthOtp(@RequestParam String phoneNumber) {
        driverService.requestOtp(phoneNumber, null);
        return ResponseEntity.ok("OTP sent to " + phoneNumber);
    }


    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP and check if the driver exists")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(
            @RequestParam String phoneNumber,
            @RequestParam String otp) {

        VerifyOtpResponse response = driverService.verifyOtp(phoneNumber, otp);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/signup")
    @Operation(summary = "Register a new driver after OTP verification")
    public ResponseEntity<DriverResponseDTO> signupDriver(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody DriverSignupDTO driverSignupDTO) {
        System.out.println("signup response coming.");
        System.out.println("Driver Signup DTO: " + driverSignupDTO);
        // Extract token from header: "Bearer <token>"
        String token = authHeader.replace("Bearer ", "");

        DriverResponseDTO response = driverService.signupDriver(token, driverSignupDTO);

        return ResponseEntity.ok(response);
    }


}
