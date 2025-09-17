package com.niyat.ride.features.admin.vehicle_type_management.controllers;

import com.niyat.ride.features.admin.vehicle_type_management.dtos.VehicleTypeRequestDTO;
import com.niyat.ride.features.admin.vehicle_type_management.dtos.VehicleTypeCreateRequestDTO;
import com.niyat.ride.features.admin.vehicle_type_management.dtos.VehicleTypeResponseDTO;
import com.niyat.ride.features.admin.vehicle_type_management.dtos.VehicleTypeStatusDTO;
import com.niyat.ride.features.admin.vehicle_type_management.services.VehicleTypeService;
import com.niyat.ride.shared.utils.ApiResponse;
import com.niyat.ride.shared.utils.PaginationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/vehicle-types")
@RequiredArgsConstructor
@Tag(name = "Vehicle Type Management", description = "Admin endpoints for managing vehicle types and pricing")
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    @GetMapping
    @Operation(summary = "Get all vehicle types with pagination and filtering")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllVehicleTypes(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive) {

        Page<VehicleTypeResponseDTO> vehicleTypesPage = vehicleTypeService.getAllVehicleTypes(
                page, size, sortBy, sortDirection, search, isActive);

        return ResponseEntity.ok(ApiResponse.success(PaginationUtil.createPageResponse(vehicleTypesPage)));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active vehicle types")
    public ResponseEntity<ApiResponse<List<VehicleTypeResponseDTO>>> getAllActiveVehicleTypes() {
        List<VehicleTypeResponseDTO> activeVehicleTypes = vehicleTypeService.getAllActiveVehicleTypes();
        return ResponseEntity.ok(ApiResponse.success(activeVehicleTypes));
    }

    @PostMapping
    @Operation(summary = "Create new vehicle type with pricing and image upload")
    public ResponseEntity<ApiResponse<VehicleTypeResponseDTO>> createVehicleType(
            @Valid @ModelAttribute VehicleTypeCreateRequestDTO request,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        VehicleTypeResponseDTO vehicleType = vehicleTypeService.createVehicleTypeWithImage(request, imageFile);
        return ResponseEntity.created(URI.create("/api/admin/vehicle-types/" + vehicleType.getId()))
                .body(ApiResponse.success(vehicleType));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific vehicle type details")
    public ResponseEntity<ApiResponse<VehicleTypeResponseDTO>> getVehicleTypeById(@PathVariable Long id) {
        VehicleTypeResponseDTO vehicleType = vehicleTypeService.getVehicleTypeById(id);
        return ResponseEntity.ok(ApiResponse.success(vehicleType));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vehicle type and pricing")
    public ResponseEntity<ApiResponse<VehicleTypeResponseDTO>> updateVehicleType(
            @PathVariable Long id,
            @Valid @RequestBody VehicleTypeRequestDTO request) {
        VehicleTypeResponseDTO vehicleType = vehicleTypeService.updateVehicleType(id, request);
        return ResponseEntity.ok(ApiResponse.success(vehicleType));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vehicle type (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteVehicleType(@PathVariable Long id) {
        vehicleTypeService.deleteVehicleType(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Activate/deactivate vehicle type")
    public ResponseEntity<ApiResponse<VehicleTypeResponseDTO>> updateVehicleTypeStatus(
            @PathVariable Long id,
            @Valid @RequestBody VehicleTypeStatusDTO statusDTO) {
        VehicleTypeResponseDTO vehicleType = vehicleTypeService.updateVehicleTypeStatus(id, statusDTO.getIsActive());
        return ResponseEntity.ok(ApiResponse.success(vehicleType));
    }
}
