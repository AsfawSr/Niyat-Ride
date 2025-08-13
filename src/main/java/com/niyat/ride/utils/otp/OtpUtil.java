package com.niyat.ride.utils.otp;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class OtpUtil {
    
    private static final SecureRandom random = new SecureRandom();
    private static final int OTP_LENGTH = 6;
    
    /**
     * Generate a random 6-digit OTP
     * @return String representation of the OTP
     */
    public String generateOtp() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    
    /**
     * Validate if the provided OTP matches the expected OTP
     * @param providedOtp OTP provided by user
     * @param expectedOtp OTP stored in database
     * @return true if OTPs match, false otherwise
     */
    public boolean validateOtp(String providedOtp, String expectedOtp) {
        if (providedOtp == null || expectedOtp == null) {
            return false;
        }
        return providedOtp.trim().equals(expectedOtp.trim());
    }
}
