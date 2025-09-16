package com.niyat.ride.features.admin.vehicle_type_management.services;

import com.niyat.ride.features.admin.vehicle_type_management.dtos.VehicleTypeRequestDTO;
import com.niyat.ride.features.admin.vehicle_type_management.dtos.VehicleTypeResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface VehicleTypeService {
    Page<VehicleTypeResponseDTO> getAllVehicleTypes(Integer page, Integer size, String sortBy, String sortDirection,
                                                   String search, Boolean isActive);
    
    List<VehicleTypeResponseDTO> getAllActiveVehicleTypes();
    
    VehicleTypeResponseDTO createVehicleType(VehicleTypeRequestDTO request);
    
    VehicleTypeResponseDTO getVehicleTypeById(Long id);
    
    VehicleTypeResponseDTO updateVehicleType(Long id, VehicleTypeRequestDTO request);
    
    void deleteVehicleType(Long id);
    
    VehicleTypeResponseDTO updateVehicleTypeStatus(Long id, Boolean isActive);
}
