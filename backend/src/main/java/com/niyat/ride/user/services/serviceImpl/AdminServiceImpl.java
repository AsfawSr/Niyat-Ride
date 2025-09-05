package com.niyat.ride.user.services.serviceImpl;

import com.niyat.ride.user.dtos.AdminResponseDTO;
import com.niyat.ride.user.dtos.AdminSignupDTO;
import com.niyat.ride.user.dtos.AdminUpdateDTO;
import com.niyat.ride.user.mappers.AdminMapper;
import com.niyat.ride.user.models.Admin;
import com.niyat.ride.user.repositories.AdminRepository;
import com.niyat.ride.enums.Role;
import com.niyat.ride.user.models.Credential;
import com.niyat.ride.shared.repositories.CredentialRepository;
import com.niyat.ride.user.services.AdminService;
import com.niyat.ride.utils.Helpers;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final AdminMapper adminMapper;
    private final CredentialRepository credentialRepository;


    @Override
    @Transactional
    public AdminResponseDTO signUpAdmin(AdminSignupDTO adminSignupDTO) {
        adminRepository.findByPhoneNumber(adminSignupDTO.getPhoneNumber())
                .ifPresent(a -> { throw new RuntimeException("Admin with phone number already exists"); });

        adminRepository.findByEmail(adminSignupDTO.getEmail())
                .ifPresent(a -> { throw new RuntimeException("Admin with email already exists"); });


        Admin admin = adminMapper.toEntity(adminSignupDTO);
        admin.setRole(Role.admin);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());


        Admin savedAdmin = adminRepository.save(admin);


        Credential credential = new Credential();
        credential.setEmail(adminSignupDTO.getEmail());
        credential.setUser(savedAdmin);
        credential.setPasswordHash(Helpers.encryptPassword(adminSignupDTO.getPassword()));
        credentialRepository.save(credential);

        return adminMapper.toResponseDTO(savedAdmin);
    }

    @Override
    @Transactional
    public AdminResponseDTO updateAdmin(Long adminId, AdminUpdateDTO updateDTO) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));

        if (updateDTO.getFirstName() != null) {
            admin.setFirstName(updateDTO.getFirstName());
        }
        if (updateDTO.getEmail() != null) {
            admin.setEmail(updateDTO.getEmail());
        }
        admin.setUpdatedAt(LocalDateTime.now());

        Admin updatedAdmin = adminRepository.save(admin);


        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isBlank()) {
            Credential credential = credentialRepository.findByUserId(adminId)
                    .orElseThrow(() -> new RuntimeException("Credentials not found for admin"));
            credential.setPasswordHash(Helpers.encryptPassword(updateDTO.getPassword()));
            credentialRepository.save(credential);
        }

        return adminMapper.toResponseDTO(updatedAdmin);
    }
}
