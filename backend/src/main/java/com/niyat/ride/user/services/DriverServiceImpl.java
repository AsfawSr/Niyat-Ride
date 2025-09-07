package com.niyat.ride.user.services;

import com.niyat.ride.otp.services.OtpService;
import com.niyat.ride.user.dtos.DriverSignupDTO;
import com.niyat.ride.user.dtos.DriverUpdateDTO;
import com.niyat.ride.user.mappers.DriverMapper;
import com.niyat.ride.user.models.Driver;
import com.niyat.ride.user.repositories.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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

    private final Map<String, DriverSignupDTO> tempSignupStorage = new ConcurrentHashMap<>();

    // CREATE / SIGNUP
    @Override
    @Transactional
    public DriverResponseDTO createDriver(DriverSignupDTO signupDTO) {
        String phone = signupDTO.getPhoneNumber();

        // check uniqueness
        driverRepository.findByPhoneNumber(phone)
                .ifPresent(d -> { throw new RuntimeException("Driver with phone " + phone + " already exists"); });

        driverRepository.findByLicenseNumber(signupDTO.getLicenseNumber())
                .ifPresent(d -> { throw new RuntimeException("Driver with license " + d.getLicenseNumber() + " already exists"); });

        // store temporarily until OTP verified
        tempSignupStorage.put(phone, signupDTO);
        otpService.sendOtp(phone);

        return null;
    }

    @Override
    @Transactional
    public DriverResponseDTO verifyOtp(String phoneNumber, String otp, boolean isSignup) {
        if (!otpService.verifyOtp(phoneNumber, otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        DriverResponseDTO response;

        if (isSignup) {
            DriverSignupDTO signupDTO = tempSignupStorage.get(phoneNumber);
            if (signupDTO == null) {
                throw new RuntimeException("No signup data found for phone " + phoneNumber);
            }

            Driver driver = driverMapper.toEntity(signupDTO);
            driver.setRole(Role.DRIVER);
            driver.setStatus(AccountStatus.ACTIVE);
            driver.setIsVerified(true);
            driver.setVerifiedAt(LocalDateTime.now());
            driver.setCreatedAt(LocalDateTime.now());
            driver.setUpdatedAt(LocalDateTime.now());
            driver.setIsOnline(true);
            Driver savedDriver = driverRepository.save(driver);
            response = driverMapper.toResponseDTO(savedDriver);
            tempSignupStorage.remove(phoneNumber);

        } else {
            Driver driver = driverRepository.findByPhoneNumber(phoneNumber)
                    .orElseThrow(() -> new RuntimeException("Driver not found with phone " + phoneNumber));
            response = driverMapper.toResponseDTO(driver);
        }

        otpService.clearOtp(phoneNumber);
        return response;
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
    public void requestOtp(String phoneNumber, DriverSignupDTO signupDTO, boolean isSignup) {
        if (isSignup) {
            driverRepository.findByPhoneNumber(phoneNumber)
                    .ifPresent(d -> { throw new RuntimeException("Driver with phone " + phoneNumber + " already exists"); });
            driverRepository.findByLicenseNumber(signupDTO.getLicenseNumber())
                    .ifPresent(d -> { throw new RuntimeException("Driver with license " + d.getLicenseNumber() + " already exists"); });
            tempSignupStorage.put(phoneNumber, signupDTO);
        } else {
            driverRepository.findByPhoneNumber(phoneNumber)
                    .orElseThrow(() -> new RuntimeException("Driver not found with phone " + phoneNumber));
        }
        otpService.sendOtp(phoneNumber);
    }
}
