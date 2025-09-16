package com.niyat.ride.features.admin.user_management.services;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.features.admin.user_management.dtos.DispatcherUserResponseDTO;
import com.niyat.ride.features.admin.user_management.repositories.DispatcherUserRepository;
import com.niyat.ride.dispatcher.models.Dispatcher;
import com.niyat.ride.shared.utils.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DispatcherUserServiceImpl implements DispatcherUserService {

    private final DispatcherUserRepository dispatcherUserRepository;

    @Override
    public Page<DispatcherUserResponseDTO> getAllDispatchers(Integer page, Integer size, String sortBy, String sortDirection,
                                                           String search, AccountStatus status, 
                                                           LocalDateTime createdAtFrom, LocalDateTime createdAtTo) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortDirection);
        Page<Dispatcher> dispatcherPage = dispatcherUserRepository.findWithFilters(search, status, createdAtFrom, createdAtTo, pageable);
        
        return dispatcherPage.map(this::mapToResponseDTO);
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
            case "assignedRegion" -> "d.assigned_region";
            default -> "u.created_at";
        };
    }

    @Override
    public DispatcherUserResponseDTO getDispatcherById(Long id) {
        Dispatcher dispatcher = dispatcherUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispatcher not found with id: " + id));
        return mapToResponseDTO(dispatcher);
    }

    @Override
    @Transactional
    public DispatcherUserResponseDTO updateDispatcherStatus(Long id, AccountStatus status) {
        Dispatcher dispatcher = dispatcherUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispatcher not found with id: " + id));
        
        dispatcher.setStatus(status);
        dispatcher.setUpdatedAt(LocalDateTime.now());
        
        Dispatcher updatedDispatcher = dispatcherUserRepository.save(dispatcher);
        return mapToResponseDTO(updatedDispatcher);
    }

    private DispatcherUserResponseDTO mapToResponseDTO(Dispatcher dispatcher) {
        DispatcherUserResponseDTO dto = new DispatcherUserResponseDTO();
        dto.setId(dispatcher.getId());
        dto.setFirstName(dispatcher.getFirstName());
        dto.setLastName(dispatcher.getLastName());
        dto.setPhoneNumber(dispatcher.getPhoneNumber());
        dto.setEmail(dispatcher.getEmail());
        dto.setIsVerified(dispatcher.getIsVerified());
        dto.setVerifiedAt(dispatcher.getVerifiedAt());
        dto.setRole(dispatcher.getRole());
        dto.setStatus(dispatcher.getStatus());
        dto.setCreatedAt(dispatcher.getCreatedAt());
        dto.setUpdatedAt(dispatcher.getUpdatedAt());
        dto.setAssignedRegion(dispatcher.getAssignedRegion());
        return dto;
    }
}
