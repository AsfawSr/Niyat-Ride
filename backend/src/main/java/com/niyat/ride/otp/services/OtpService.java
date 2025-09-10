package com.niyat.ride.otp.services;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final AfroMessageService afroMessageService;
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public OtpService(AfroMessageService afroMessageService) {
        this.afroMessageService = afroMessageService;
    }

    public String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }

    public void sendOtp(String phoneNumber) {
        String otp = generateOtp();
        otpStorage.put(phoneNumber, otp);

        try {
            afroMessageService.sendSms("+251" + phoneNumber, "Your Niyat Ride OTP code is: " + otp);
        } catch (IOException e) {

            throw new RuntimeException("Failed to send OTP via AfroMessage", e);
        }
    }

    public boolean verifyOtp(String phoneNumber, String otp) {
        return otp.equals(otpStorage.get(phoneNumber));
    }

    public void clearOtp(String phoneNumber) {
        otpStorage.remove(phoneNumber);
    }
}
