package com.niyat.ride.features.admin.vehicle_type_management.services;

import com.niyat.ride.features.admin.vehicle_type_management.dtos.VehicleTypeRequestDTO;
import com.niyat.ride.features.admin.vehicle_type_management.dtos.VehicleTypeResponseDTO;
import com.niyat.ride.features.admin.vehicle_type_management.repositories.VehicleTypeRepository;
import com.niyat.ride.vehicle.models.VehicleType;
import com.niyat.ride.shared.utils.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleTypeServiceImpl implements VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;

    @Override
    public Page<VehicleTypeResponseDTO> getAllVehicleTypes(Integer page, Integer size, String sortBy, String sortDirection,
                                                          String search, Boolean isActive) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortDirection);
        Page<VehicleType> vehicleTypesPage = vehicleTypeRepository.findWithFilters(search, isActive, pageable);
        
        return vehicleTypesPage.map(this::mapToResponseDTO);
    }

    @Override
    public List<VehicleTypeResponseDTO> getAllActiveVehicleTypes() {
        List<VehicleType> activeVehicleTypes = vehicleTypeRepository.findAllActiveTypes();
        return activeVehicleTypes.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VehicleTypeResponseDTO createVehicleType(VehicleTypeRequestDTO request) {
        // Check if name already exists
        vehicleTypeRepository.findByNameAndDeletedAtIsNull(request.getName())
                .ifPresent(vt -> {
                    throw new RuntimeException("Vehicle type with name '" + request.getName() + "' already exists");
                });

        VehicleType vehicleType = new VehicleType();
        vehicleType.setName(request.getName());
        vehicleType.setDescription(request.getDescription());
        vehicleType.setImage(request.getImage());
        vehicleType.setPricePerKm(request.getPricePerKm());
        vehicleType.setCapacity(request.getCapacity());
        vehicleType.setFeatures(request.getFeatures());
        vehicleType.setIsActive(true);

        VehicleType savedVehicleType = vehicleTypeRepository.save(vehicleType);
        return mapToResponseDTO(savedVehicleType);
    }

    @Override
    public VehicleTypeResponseDTO getVehicleTypeById(Long id) {
        VehicleType vehicleType = vehicleTypeRepository.findByIdActive(id)
                .orElseThrow(() -> new RuntimeException("Vehicle type not found with id: " + id));
        return mapToResponseDTO(vehicleType);
    }

    @Override
    @Transactional
    public VehicleTypeResponseDTO updateVehicleType(Long id, VehicleTypeRequestDTO request) {
        VehicleType vehicleType = vehicleTypeRepository.findByIdActive(id)
                .orElseThrow(() -> new RuntimeException("Vehicle type not found with id: " + id));

        // Check if name already exists (excluding current record)
        vehicleTypeRepository.findByNameAndDeletedAtIsNull(request.getName())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Vehicle type with name '" + request.getName() + "' already exists");
                    }
                });

        vehicleType.setName(request.getName());
        vehicleType.setDescription(request.getDescription());
        vehicleType.setImage(request.getImage());
        vehicleType.setPricePerKm(request.getPricePerKm());
        vehicleType.setCapacity(request.getCapacity());
        vehicleType.setFeatures(request.getFeatures());
        vehicleType.setUpdatedAt(LocalDateTime.now());

        VehicleType updatedVehicleType = vehicleTypeRepository.save(vehicleType);
        return mapToResponseDTO(updatedVehicleType);
    }

    @Override
    @Transactional
    public void deleteVehicleType(Long id) {
        VehicleType vehicleType = vehicleTypeRepository.findByIdActive(id)
                .orElseThrow(() -> new RuntimeException("Vehicle type not found with id: " + id));

        // Check if vehicle type has active rides
        if (vehicleTypeRepository.hasActiveRides(id)) {
            throw new RuntimeException("Cannot delete vehicle type with active rides. Please deactivate instead.");
        }

        // Soft delete
        vehicleType.setDeletedAt(LocalDateTime.now());
        vehicleType.setIsActive(false);
        vehicleType.setUpdatedAt(LocalDateTime.now());
        
        vehicleTypeRepository.save(vehicleType);
    }

    @Override
    @Transactional
    public VehicleTypeResponseDTO updateVehicleTypeStatus(Long id, Boolean isActive) {
        VehicleType vehicleType = vehicleTypeRepository.findByIdActive(id)
                .orElseThrow(() -> new RuntimeException("Vehicle type not found with id: " + id));

        vehicleType.setIsActive(isActive);
        vehicleType.setUpdatedAt(LocalDateTime.now());

        VehicleType updatedVehicleType = vehicleTypeRepository.save(vehicleType);
        return mapToResponseDTO(updatedVehicleType);
    }

    private VehicleTypeResponseDTO mapToResponseDTO(VehicleType vehicleType) {
        VehicleTypeResponseDTO dto = new VehicleTypeResponseDTO();
        dto.setId(vehicleType.getId());
        dto.setName(vehicleType.getName());
        dto.setDescription(vehicleType.getDescription());
        dto.setImage(vehicleType.getImage());
        dto.setPricePerKm(vehicleType.getPricePerKm());
        dto.setIsActive(vehicleType.getIsActive());
        dto.setCreatedAt(vehicleType.getCreatedAt());
        dto.setUpdatedAt(vehicleType.getUpdatedAt());
        dto.setCapacity(vehicleType.getCapacity());
        dto.setFeatures(vehicleType.getFeatures());
        return dto;
    }
}
