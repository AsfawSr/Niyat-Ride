package com.niyat.ride.user.services;

import com.niyat.ride.user.dtos.DriverResponseDTO;
import com.niyat.ride.user.dtos.DriverSignupDTO;
import com.niyat.ride.user.dtos.DriverUpdateDTO;

public interface DriverService {
    void requestOtp(String phoneNumber, DriverSignupDTO signupDTO, boolean isSignup);
    DriverResponseDTO verifyOtp(String phoneNumber, String otp, boolean isSignup);
    DriverResponseDTO updateDriver(Long driverId, DriverUpdateDTO updateDTO);
}
