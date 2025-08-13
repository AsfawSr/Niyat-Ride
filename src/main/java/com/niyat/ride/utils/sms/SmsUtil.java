package com.niyat.ride.utils.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SmsUtil {
    
    /**
     * Mock SMS sending functionality - logs to console
     * In production, this would integrate with SMS service provider like Twilio, AWS SNS, etc.
     * 
     * @param phoneNumber recipient phone number
     * @param otp OTP to send
     * @return true if SMS was "sent" successfully
     */
    public boolean sendOtp(String phoneNumber, String otp) {
        try {
            // Mock SMS sending - log to console
            log.info("=== SMS SERVICE ===");
            log.info("Sending OTP to phone number: {}", phoneNumber);
            log.info("OTP: {}", otp);
            log.info("Message: Your Niyat Ride verification code is: {}. Do not share this code with anyone.", otp);
            log.info("==================");
            
            // Simulate network delay
            Thread.sleep(100);
            
            return true;
        } catch (Exception e) {
            log.error("Failed to send OTP to {}: {}", phoneNumber, e.getMessage());
            return false;
        }
    }
}
