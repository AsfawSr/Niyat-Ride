package com.niyat.ride.features.admin.user_management.services;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.features.admin.user_management.dtos.CustomerUserResponseDTO;
import com.niyat.ride.features.admin.user_management.repositories.CustomerUserRepository;
import com.niyat.ride.user.models.Customer;
import com.niyat.ride.shared.utils.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CustomerUserServiceImpl implements CustomerUserService {

    private final CustomerUserRepository customerUserRepository;

    @Override
    public Page<CustomerUserResponseDTO> getAllCustomers(Integer page, Integer size, String sortBy, String sortDirection,
                                                        String search, AccountStatus status, 
                                                        LocalDateTime createdAtFrom, LocalDateTime createdAtTo) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortDirection);
        Page<Customer> customerPage = customerUserRepository.findWithFilters(search, status, createdAtFrom, createdAtTo, pageable);
        
        return customerPage.map(this::mapToResponseDTO);
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
    public CustomerUserResponseDTO getCustomerById(Long id) {
        Customer customer = customerUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return mapToResponseDTO(customer);
    }

    @Override
    @Transactional
    public CustomerUserResponseDTO updateCustomerStatus(Long id, AccountStatus status) {
        Customer customer = customerUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        
        customer.setStatus(status);
        customer.setUpdatedAt(LocalDateTime.now());
        
        Customer updatedCustomer = customerUserRepository.save(customer);
        return mapToResponseDTO(updatedCustomer);
    }

    private CustomerUserResponseDTO mapToResponseDTO(Customer customer) {
        CustomerUserResponseDTO dto = new CustomerUserResponseDTO();
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setEmail(customer.getEmail());
        dto.setIsVerified(customer.getIsVerified());
        dto.setVerifiedAt(customer.getVerifiedAt());
        dto.setRole(customer.getRole());
        dto.setStatus(customer.getStatus());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());
        return dto;
    }
}
