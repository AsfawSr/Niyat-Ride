package com.niyat.ride.auth.services;

import com.niyat.ride.user.models.Credential;
import com.niyat.ride.shared.repositories.CredentialRepository;
import com.niyat.ride.auth.dtos.AuthResponseDTO;
import com.niyat.ride.auth.dtos.LoginRequestDTO;
import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.user.models.User;
import com.niyat.ride.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final CredentialRepository credentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponseDTO loginWithPassword(LoginRequestDTO request) {

        Credential credential = credentialRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!Boolean.TRUE.equals(credential.getActive())) {
            throw new RuntimeException("Account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), credential.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = credential.getUser();
        if (user.getStatus() == AccountStatus.SUSPENDED || user.getStatus() == AccountStatus.DEACTIVATED) {
            throw new RuntimeException("Account not allowed to login");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        return new AuthResponseDTO(token, user.getId(), user.getRole().name());
    }
}

