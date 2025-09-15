package com.niyat.ride.features.admin.user_management.services;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.features.admin.user_management.dtos.DriverUserResponseDTO;
import com.niyat.ride.features.admin.user_management.repositories.DriverUserRepository;
import com.niyat.ride.user.models.Driver;
import com.niyat.ride.shared.utils.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DriverUserServiceImpl implements DriverUserService {

    private final DriverUserRepository driverUserRepository;

    @Override
    public Page<DriverUserResponseDTO> getAllDrivers(Integer page, Integer size, String sortBy, String sortDirection,
                                                    String search, AccountStatus status, 
                                                    LocalDateTime createdAtFrom, LocalDateTime createdAtTo) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortDirection);
        Page<Driver> driverPage = driverUserRepository.findWithFilters(search, status, createdAtFrom, createdAtTo, pageable);
        
        return driverPage.map(this::mapToResponseDTO);
    }
    
    private String mapSortFieldToColumn(String sortBy) {
        if (sortBy == null) return "u.created_at";
        
        return switch (sortBy) {
            case "createdAt" -> "u.created_at";
            case "updatedAt" -> "u.updated_at";
            case "firstName" -> "u.first_name";
            case "lastName" -> "u.last_name";
            case "email" -> "u.email";
            case "status" -> "u.status";
            case "licenseNumber" -> "d.license_number";
            default -> "u.created_at";
        };
    }

    @Override
    public DriverUserResponseDTO getDriverById(Long id) {
        Driver driver = driverUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        return mapToResponseDTO(driver);
    }

    @Override
    @Transactional
    public DriverUserResponseDTO updateDriverStatus(Long id, AccountStatus status) {
        Driver driver = driverUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        
        driver.setStatus(status);
        driver.setUpdatedAt(LocalDateTime.now());
        
        Driver updatedDriver = driverUserRepository.save(driver);
        return mapToResponseDTO(updatedDriver);
    }

    private DriverUserResponseDTO mapToResponseDTO(Driver driver) {
        DriverUserResponseDTO dto = new DriverUserResponseDTO();
        dto.setId(driver.getId());
        dto.setFirstName(driver.getFirstName());
        dto.setLastName(driver.getLastName());
        dto.setPhoneNumber(driver.getPhoneNumber());
        dto.setEmail(driver.getEmail());
        dto.setIsVerified(driver.getIsVerified());
        dto.setVerifiedAt(driver.getVerifiedAt());
        dto.setRole(driver.getRole());
        dto.setStatus(driver.getStatus());
        dto.setCreatedAt(driver.getCreatedAt());
        dto.setUpdatedAt(driver.getUpdatedAt());
        dto.setLicenseNumber(driver.getLicenseNumber());
        dto.setLicenseImagePath(driver.getLicenseImagePath());
        return dto;
    }
}
