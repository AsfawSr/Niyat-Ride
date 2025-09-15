package com.niyat.ride.user.services;

import com.niyat.ride.otp.services.OtpService;
import com.niyat.ride.security.JwtUtil;
import com.niyat.ride.user.dtos.DriverSignupDTO;
import com.niyat.ride.user.dtos.DriverUpdateDTO;
import com.niyat.ride.user.dtos.VerifyOtpResponse;
import com.niyat.ride.user.mappers.DriverMapper;
import com.niyat.ride.user.models.Driver;
import com.niyat.ride.user.repositories.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import com.niyat.ride.user.dtos.DriverResponseDTO;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final OtpService otpService;
    private final DriverMapper driverMapper;
    private final DriverRepository driverRepository;
    private final JwtUtil jwtUtil;

    private final Map<String, DriverSignupDTO> tempSignupStorage = new ConcurrentHashMap<>();

    @Override
    public void requestOtp(String phoneNumber, DriverSignupDTO signupDTO) {
        otpService.sendOtp(phoneNumber);
    }

    @Override
    @Transactional
    public VerifyOtpResponse verifyOtp(String phoneNumber, String otp) {
        //  Verify OTP
        if (!otpService.verifyOtp(phoneNumber, otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        //  Check if driver exists
        Optional<Driver> existingDriver = driverRepository.findByPhoneNumber(phoneNumber);

        String tempToken = jwtUtil.generateTempToken(phoneNumber);

        VerifyOtpResponse response = new VerifyOtpResponse();
        response.setToken(tempToken);

        if (existingDriver.isPresent()) {
            response.setRegistered(true);
            response.setDriver(driverMapper.toResponseDTO(existingDriver.get()));
        } else {
            response.setRegistered(false);
            response.setDriver(null);
        }

        //  Clear OTP after use
        otpService.clearOtp(phoneNumber);

        return response;
    }


    //  SIGNUP
    public DriverResponseDTO signupDriver(String token, DriverSignupDTO signupDTO) {
        //  Validate temp token
        if (!jwtUtil.validateTempToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        //  Extract phone number from token
        String phoneNumber = jwtUtil.extractPhoneNumber(token);

        //  Ensure phone isn’t already registered
        driverRepository.findByPhoneNumber(phoneNumber)
                .ifPresent(d -> { throw new RuntimeException("Driver already exists with phone " + phoneNumber); });

        //  Ensure license isn’t already registered
        driverRepository.findByLicenseNumber(signupDTO.getLicenseNumber())
                .ifPresent(d -> { throw new RuntimeException("Driver already exists with license " + signupDTO.getLicenseNumber()); });


        // Map DTO to entity
        Driver driver = driverMapper.toEntity(signupDTO);
        driver.setPhoneNumber(phoneNumber);
        driver.setRole(Role.DRIVER);
        driver.setStatus(AccountStatus.ACTIVE);
        driver.setIsVerified(true);
        driver.setVerifiedAt(LocalDateTime.now());
        driver.setCreatedAt(LocalDateTime.now());
        driver.setUpdatedAt(LocalDateTime.now());
        driver.setIsOnline(false);

        //  Save driver
        Driver savedDriver = driverRepository.save(driver);

        //  Return response DTO
        return driverMapper.toResponseDTO(savedDriver);
    }


    // READ
    @Override
    public DriverResponseDTO getDriverById(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id " + id));
        return driverMapper.toResponseDTO(driver);
    }

    @Override
    public List<DriverResponseDTO> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(driverMapper::toResponseDTO)
                .toList();
    }



    // UPDATE
    @Override
    public DriverResponseDTO updateDriver(Long id, DriverUpdateDTO updatedDTO) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id " + id));

        // update only the allowed fields
        driver.setFirstName(updatedDTO.getFirstName());
        driver.setLastName(updatedDTO.getLastName());
        driver.setEmail(updatedDTO.getEmail());
        driver.setLicenseNumber(updatedDTO.getLicenseNumber());
        driver.setPhoneNumber(updatedDTO.getPhoneNumber());
        driver.setVehicleModel(updatedDTO.getVehicleModel());
        driver.setVehiclePlateNumber(updatedDTO.getVehiclePlateNumber());
        driver.setFrontLicenceImage(updatedDTO.getFrontLicenceImage());
        driver.setBackLicenceImage(updatedDTO.getBackLicenceImage());

        driver.setUpdatedAt(LocalDateTime.now());

        driver.setStatus(driver.getStatus() != null ? driver.getStatus() : AccountStatus.ACTIVE);

        Driver savedDriver = driverRepository.save(driver);
        return driverMapper.toResponseDTO(savedDriver);
    }


    // DELETE
    @Override
    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }

    // TOGGLE ONLINE STATUS
    @Override
    public DriverResponseDTO toggleOnlineStatus(Long driverId, boolean isOnline) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setIsOnline(isOnline);
        Driver savedDriver = driverRepository.save(driver);
        return driverMapper.toResponseDTO(savedDriver);
    }

    // UPDATE LOCATION
    @Override
    public DriverResponseDTO updateDriverLocation(Long driverId, Point location) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        location.setSRID(4326);
        driver.setCurrentLocation(location);
        driver.setCurrentLatitude(location.getY());
        driver.setCurrentLongitude(location.getX());

        Driver savedDriver = driverRepository.save(driver);
        return driverMapper.toResponseDTO(savedDriver);
    }

    // Nearby & online drivers
    @Override
    public List<DriverResponseDTO> findNearbyDrivers(String pickupPointWKT, double radiusMeters, int limit) {
        return driverRepository.findNearbyOnlineDrivers(pickupPointWKT, radiusMeters, limit).stream()
                .map(driverMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<DriverResponseDTO> findDriversWithinRadius(Point pickupLocation, double radiusMeters) {
        String pickupWkt = String.format("POINT(%f %f)", pickupLocation.getX(), pickupLocation.getY());
        return driverRepository.findDriversWithinRadius(pickupWkt, radiusMeters).stream()
                .map(driverMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<DriverResponseDTO> getOnlineDrivers() {
        return driverRepository.findOnlineDriversWithLocation().stream()
                .map(driverMapper::toResponseDTO)
                .toList();
    }

    @Override
    public long countDriversInRadius(String pointWKT, double radiusMeters) {
        return driverRepository.countOnlineDriversInRadius(pointWKT, radiusMeters);
    }

    @Override
    public DriverResponseDTO getDriverByPhoneNumber(String phoneNumber) {
        Driver driver = driverRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Driver not found with phone " + phoneNumber));
        return driverMapper.toResponseDTO(driver);
    }

    @Override
    public long countDrivers() {
        return driverRepository.count();
    }
}
