package com.niyat.ride.dtos.auth;

import com.niyat.ride.dtos.response.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private UserResponseDTO user;
    private String accessToken;
    private String refreshToken;
}
