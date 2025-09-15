package com.niyat.ride.user.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerifyOtpResponse {
    private boolean registered;
    private String token;
    private DriverResponseDTO driver;
}
