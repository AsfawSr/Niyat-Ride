package com.niyat.ride.user.controllers;

import com.niyat.ride.user.dtos.CustomerResponseDTO;
import com.niyat.ride.user.dtos.CustomerUpdateDTO;
import com.niyat.ride.user.services.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "Unified signup/login with OTP")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("/request-otp")
    @Operation(summary = "Request OTP for login or signup")
    public ResponseEntity<String> requestOtp(@RequestParam String phoneNumber) {
        customerService.requestOtp(phoneNumber);
        return ResponseEntity.ok("OTP sent to " + phoneNumber);
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP and login/signup user")
    public ResponseEntity<CustomerResponseDTO> verifyOtp(
            @RequestParam String phoneNumber,
            @RequestParam String otp) {

        CustomerResponseDTO response = customerService.verifyOtp(phoneNumber, otp);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/updateCustomer/{customerId}")
    @Operation(summary = "Update customer details")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(
            @PathVariable Long customerId,
            @Valid @RequestBody CustomerUpdateDTO updateDTO) {

        CustomerResponseDTO response = customerService.updateCustomer(customerId, updateDTO);
        return ResponseEntity.ok(response);
    }
}
