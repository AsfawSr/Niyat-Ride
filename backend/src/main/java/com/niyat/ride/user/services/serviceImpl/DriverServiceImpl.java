package com.niyat.ride.user.services.serviceImpl;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import com.niyat.ride.otp.services.OtpService;
import com.niyat.ride.user.dtos.DriverResponseDTO;
import com.niyat.ride.user.dtos.DriverSignupDTO;
import com.niyat.ride.user.dtos.DriverUpdateDTO;
import com.niyat.ride.user.mappers.DriverMapper;
import com.niyat.ride.user.models.Driver;
import com.niyat.ride.user.repositories.DriverRepository;
import com.niyat.ride.user.services.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;
    private final OtpService otpService;

    // temporary signup data store before OTP is verified
    private final Map<String, DriverSignupDTO> tempSignupStorage = new ConcurrentHashMap<>();

    private String normalizePhoneNumber(String phoneNumber) {
        if (!phoneNumber.startsWith("+251")) {
            return "+251" + phoneNumber;
        }
        return phoneNumber;
    }

    @Override
    public void requestOtp(String phoneNumber, DriverSignupDTO signupDTO, boolean isSignup) {
        String normalizedPhone = normalizePhoneNumber(phoneNumber);

        if (isSignup) {
            driverRepository.findByPhoneNumber(normalizedPhone)
                    .ifPresent(d -> {
                        throw new RuntimeException("Driver with phone " + normalizedPhone + " already exists");
                    });
            driverRepository.findByLicenseNumber(signupDTO.getLicenseNumber())
                    .ifPresent(d -> {
                        throw new RuntimeException("Driver with license " + d.getLicenseNumber() + " already exists");
                    });
            tempSignupStorage.put(normalizedPhone, signupDTO);
        } else {
            driverRepository.findByPhoneNumber(normalizedPhone)
                    .orElseThrow(() -> new RuntimeException("Driver not found with phone " + normalizedPhone));
        }
        otpService.sendOtp(normalizedPhone);
    }

    @Override
    @Transactional
    public DriverResponseDTO verifyOtp(String phoneNumber, String otp, boolean isSignup) {
        String normalizedPhone = normalizePhoneNumber(phoneNumber);

        if (!otpService.verifyOtp(normalizedPhone, otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        DriverResponseDTO response;
        if (isSignup) {
            DriverSignupDTO signupDTO = tempSignupStorage.get(normalizedPhone);
            if (signupDTO == null) {
                throw new RuntimeException("No signup data found for phone " + normalizedPhone);
            }

            Driver driver = driverMapper.toEntity(signupDTO);
            driver.setFirstName(signupDTO.getFirstName());
            driver.setLastName(signupDTO.getLastName());
            driver.setPhoneNumber(normalizedPhone);
            driver.setLicenseNumber(signupDTO.getLicenseNumber());
            driver.setRole(Role.DRIVER);
            driver.setStatus(AccountStatus.ACTIVE);
            driver.setIsVerified(true);
            driver.setVerifiedAt(LocalDateTime.now());
            driver.setCreatedAt(LocalDateTime.now());
            driver.setUpdatedAt(LocalDateTime.now());

            Driver savedDriver = driverRepository.save(driver);
            response = driverMapper.toResponseDTO(savedDriver);

            tempSignupStorage.remove(normalizedPhone);
        } else {
            Driver driver = driverRepository.findByPhoneNumber(normalizedPhone)
                    .orElseThrow(() -> new RuntimeException("Driver not found with phone " + normalizedPhone));
            response = driverMapper.toResponseDTO(driver);
        }

        otpService.clearOtp(normalizedPhone);
        return response;
    }

    @Override
    @Transactional
    public DriverResponseDTO updateDriver(Long driverId, DriverUpdateDTO updateDTO) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found with id " + driverId));

        driver.setEmail(updateDTO.getEmail());
        driver.setUpdatedAt(LocalDateTime.now());

        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponseDTO(updatedDriver);
    }
}
