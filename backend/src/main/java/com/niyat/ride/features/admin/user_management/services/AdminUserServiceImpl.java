package com.niyat.ride.features.admin.user_management.services;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.features.admin.user_management.dtos.AdminUserResponseDTO;
import com.niyat.ride.features.admin.user_management.repositories.AdminUserRepository;
import com.niyat.ride.user.models.Admin;
import com.niyat.ride.shared.utils.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AdminUserRepository adminUserRepository;

    @Override
    public Page<AdminUserResponseDTO> getAllAdmins(Integer page, Integer size, String sortBy, String sortDirection,
                                                  String search, AccountStatus status, 
                                                  LocalDateTime createdAtFrom, LocalDateTime createdAtTo) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortDirection);
        Page<Admin> adminPage = adminUserRepository.findWithFilters(search, status, createdAtFrom, createdAtTo, pageable);
        
        return adminPage.map(this::mapToResponseDTO);
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
            default -> "u.created_at";
        };
    }

    @Override
    public AdminUserResponseDTO getAdminById(Long id) {
        Admin admin = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        return mapToResponseDTO(admin);
    }

    @Override
    @Transactional
    public AdminUserResponseDTO updateAdminStatus(Long id, AccountStatus status) {
        Admin admin = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        
        admin.setStatus(status);
        admin.setUpdatedAt(LocalDateTime.now());
        
        Admin updatedAdmin = adminUserRepository.save(admin);
        return mapToResponseDTO(updatedAdmin);
    }

    private AdminUserResponseDTO mapToResponseDTO(Admin admin) {
        AdminUserResponseDTO dto = new AdminUserResponseDTO();
        dto.setId(admin.getId());
        dto.setFirstName(admin.getFirstName());
        dto.setLastName(admin.getLastName());
        dto.setPhoneNumber(admin.getPhoneNumber());
        dto.setEmail(admin.getEmail());
        dto.setIsVerified(admin.getIsVerified());
        dto.setVerifiedAt(admin.getVerifiedAt());
        dto.setRole(admin.getRole());
        dto.setStatus(admin.getStatus());
        dto.setCreatedAt(admin.getCreatedAt());
        dto.setUpdatedAt(admin.getUpdatedAt());
        return dto;
    }
}
