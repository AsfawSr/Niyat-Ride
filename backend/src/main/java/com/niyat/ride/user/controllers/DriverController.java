package com.niyat.ride.user.controllers;

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
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
@Tag(name = "Driver Management", description = "Endpoints for driver operations")
public class DriverController {

    private final DriverService driverService;

    @PostMapping("/signup/request-otp")
    @Operation(summary = "Request OTP for driver signup")
    public ResponseEntity<String> requestSignupOtp(@Valid @RequestBody DriverSignupDTO driverSignupDTO) {
        driverService.requestOtp(driverSignupDTO.getPhoneNumber(), driverSignupDTO, true);
        return ResponseEntity.ok("OTP sent to " + driverSignupDTO.getPhoneNumber());
    }

    @PostMapping("/signup/verify-otp")
    @Operation(summary = "Verify OTP and complete driver signup")
    public ResponseEntity<DriverResponseDTO> verifySignupOtp(
            @RequestParam String phoneNumber,
            @RequestParam String otp) {

        DriverResponseDTO response = driverService.verifyOtp(phoneNumber, otp, true);
        return ResponseEntity.created(URI.create("/api/drivers/" + response.getId()))
                .body(response);
    }

    @PostMapping("/login/request-otp")
    @Operation(summary = "Request OTP for driver login")
    public ResponseEntity<String> requestLoginOtp(@RequestParam String phoneNumber) {
        driverService.requestOtp(phoneNumber, null, false);
        return ResponseEntity.ok("OTP sent to " + phoneNumber);
    }

    @PostMapping("/login/verify-otp")
    @Operation(summary = "Verify OTP and log in driver")
    public ResponseEntity<DriverResponseDTO> verifyLoginOtp(
            @RequestParam String phoneNumber,
            @RequestParam String otp) {

        DriverResponseDTO response = driverService.verifyOtp(phoneNumber, otp, false);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/updateDriver/{driverId}")
    @Operation(summary = "Update driver details")
    public ResponseEntity<DriverResponseDTO> updateDriver(
            @PathVariable Long driverId,
            @Valid @RequestBody DriverUpdateDTO updateDTO) {

        DriverResponseDTO response = driverService.updateDriver(driverId, updateDTO);
        return ResponseEntity.ok(response);
    }
}
