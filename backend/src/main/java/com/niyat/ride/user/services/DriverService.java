package com.niyat.ride.user.services;

import com.niyat.ride.user.dtos.DriverResponseDTO;
import com.niyat.ride.user.dtos.DriverSignupDTO;
import com.niyat.ride.user.dtos.DriverUpdateDTO;
import org.locationtech.jts.geom.Point;

import java.util.List;

public interface DriverService {

    DriverResponseDTO createDriver(DriverSignupDTO signupDTO);

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

    void requestOtp(String phoneNumber, DriverSignupDTO signupDTO, boolean isSignup);
    DriverResponseDTO verifyOtp(String phoneNumber, String otp, boolean isSignup);

    long countDriversInRadius(String pointWKT, double radiusMeters);
}
