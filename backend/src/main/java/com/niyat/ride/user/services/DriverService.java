package com.niyat.ride.user.services;

import com.niyat.ride.user.dtos.DriverResponseDTO;
import com.niyat.ride.user.dtos.DriverSignupDTO;
import com.niyat.ride.user.dtos.DriverUpdateDTO;
import com.niyat.ride.user.dtos.VerifyOtpResponse;
import org.locationtech.jts.geom.Point;

import java.util.List;

public interface DriverService {

    DriverResponseDTO  signupDriver(String token, DriverSignupDTO signupDTO);

    DriverResponseDTO getDriverById(Long id);
    List<DriverResponseDTO> getAllDrivers();

    DriverResponseDTO updateDriver(Long id, DriverUpdateDTO updatedDTO);  // ✅ keep only this

    void deleteDriver(Long id);

    DriverResponseDTO toggleOnlineStatus(Long driverId, boolean isOnline);
    DriverResponseDTO updateDriverLocation(Long driverId, Point location);

    List<DriverResponseDTO> findNearbyDrivers(String pickupPointWKT, double radiusMeters, int limit);
    List<DriverResponseDTO> findDriversWithinRadius(Point pickupLocation, double radiusMeters);
    List<DriverResponseDTO> getOnlineDrivers();

    DriverResponseDTO getDriverByPhoneNumber(String phoneNumber);

    void requestOtp(String phoneNumber, DriverSignupDTO signupDTO);
    VerifyOtpResponse verifyOtp(String phoneNumber, String otp);

    long countDriversInRadius(String pointWKT, double radiusMeters);

    long countDrivers();

}
