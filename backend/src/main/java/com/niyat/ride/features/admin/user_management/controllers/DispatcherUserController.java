package com.niyat.ride.features.admin.user_management.controllers;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.features.admin.user_management.dtos.DispatcherUserResponseDTO;
import com.niyat.ride.features.admin.user_management.dtos.StatusUpdateRequestDTO;
import com.niyat.ride.features.admin.user_management.services.DispatcherUserService;
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
@RequestMapping("/api/admin/dispatchers")
@RequiredArgsConstructor
@Tag(name = "Dispatcher User Management", description = "Admin endpoints for managing dispatcher users")
public class DispatcherUserController {

    private final DispatcherUserService dispatcherUserService;

    @GetMapping
    @Operation(summary = "Get all dispatcher users with filtering and pagination")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllDispatchers(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtTo) {

        Page<DispatcherUserResponseDTO> dispatchersPage = dispatcherUserService.getAllDispatchers(
                page, size, sortBy, sortDirection, search, status, createdAtFrom, createdAtTo);

        return ResponseEntity.ok(ApiResponse.success(PaginationUtil.createPageResponse(dispatchersPage)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get dispatcher user by ID")
    public ResponseEntity<ApiResponse<DispatcherUserResponseDTO>> getDispatcherById(@PathVariable Long id) {
        DispatcherUserResponseDTO dispatcher = dispatcherUserService.getDispatcherById(id);
        return ResponseEntity.ok(ApiResponse.success(dispatcher));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update dispatcher user status")
    public ResponseEntity<ApiResponse<DispatcherUserResponseDTO>> updateDispatcherStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDTO request) {
        DispatcherUserResponseDTO dispatcher = dispatcherUserService.updateDispatcherStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(dispatcher));
    }
}
