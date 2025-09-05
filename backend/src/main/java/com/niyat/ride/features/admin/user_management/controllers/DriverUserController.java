package com.niyat.ride.features.admin.user_management.controllers;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.features.admin.user_management.dtos.DriverUserResponseDTO;
import com.niyat.ride.features.admin.user_management.dtos.StatusUpdateRequestDTO;
import com.niyat.ride.features.admin.user_management.services.DriverUserService;
import com.niyat.ride.shared.utils.ApiResponse;
import com.niyat.ride.shared.utils.PaginationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/drivers")
@RequiredArgsConstructor
@Tag(name = "Driver User Management", description = "Admin endpoints for managing driver users")
public class DriverUserController {

    private final DriverUserService driverUserService;

    @GetMapping
    @Operation(summary = "Get all driver users with filtering and pagination")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllDrivers(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtTo) {

        Page<DriverUserResponseDTO> driversPage = driverUserService.getAllDrivers(
                page, size, sortBy, sortDirection, search, status, createdAtFrom, createdAtTo);

        return ResponseEntity.ok(ApiResponse.success(PaginationUtil.createPageResponse(driversPage)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get driver user by ID")
    public ResponseEntity<ApiResponse<DriverUserResponseDTO>> getDriverById(@PathVariable Long id) {
        DriverUserResponseDTO driver = driverUserService.getDriverById(id);
        return ResponseEntity.ok(ApiResponse.success(driver));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update driver user status")
    public ResponseEntity<ApiResponse<DriverUserResponseDTO>> updateDriverStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDTO request) {
        DriverUserResponseDTO driver = driverUserService.updateDriverStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(driver));
    }
}
