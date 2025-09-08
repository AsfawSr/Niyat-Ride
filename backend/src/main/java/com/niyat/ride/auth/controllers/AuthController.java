package com.niyat.ride.auth.controllers;

import com.niyat.ride.auth.dtos.AuthResponseDTO;
import com.niyat.ride.auth.dtos.LoginRequestDTO;
import com.niyat.ride.auth.services.AuthService;
import com.niyat.ride.shared.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@RequestBody LoginRequestDTO request) {
        AuthResponseDTO resp = authService.loginWithPassword(request);
        return ResponseEntity.ok(ApiResponse.success(resp, "Login successful"));
    }

}
