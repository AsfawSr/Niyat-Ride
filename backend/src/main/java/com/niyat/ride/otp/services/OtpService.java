package com.niyat.ride.otp.services;

import com.niyat.ride.otp.models.OtpEntry;
import com.niyat.ride.otp.repositories.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;
@Service
@RequiredArgsConstructor
public class OtpService {

    private final AfroMessageService afroMessageService;
    private final OtpRepository otpRepository;

    public String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }

    private String normalizePhoneNumber(String phoneNumber) {
        if (!phoneNumber.startsWith("+251")) {
            return "+251" + phoneNumber;
        }
        return phoneNumber;
    }

    public void sendOtp(String phoneNumber) {
        String normalizedPhone = normalizePhoneNumber(phoneNumber);
        String otp = generateOtp();
        LocalDateTime now = LocalDateTime.now();

        OtpEntry entry = OtpEntry.builder()
                .phoneNumber(normalizedPhone)
                .otp(otp)
                .createdAt(now)
                .expiresAt(now.plusMinutes(5))
                .build();

        otpRepository.save(entry);

        try {
            afroMessageService.sendSms(normalizedPhone, "Your Niyat Ride OTP code is: " + otp);
        } catch (IOException e) {
            throw new RuntimeException("Failed to send OTP via AfroMessage", e);
        }
    }

    public boolean verifyOtp(String phoneNumber, String otp) {
        String normalizedPhone = normalizePhoneNumber(phoneNumber);
        return otpRepository.findByPhoneNumber(normalizedPhone)
                .filter(entry -> entry.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(entry -> entry.getOtp().equals(otp))
                .orElse(false);
    }

    public void clearOtp(String phoneNumber) {
        otpRepository.deleteById(normalizePhoneNumber(phoneNumber));
    }
}
