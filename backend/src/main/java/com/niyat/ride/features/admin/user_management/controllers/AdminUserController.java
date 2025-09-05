package com.niyat.ride.features.admin.user_management.controllers;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.features.admin.user_management.dtos.AdminUserResponseDTO;
import com.niyat.ride.features.admin.user_management.dtos.StatusUpdateRequestDTO;
import com.niyat.ride.features.admin.user_management.services.AdminUserService;
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
@RequestMapping("/api/admin/admins")
@RequiredArgsConstructor
@Tag(name = "Admin User Management", description = "Admin endpoints for managing admin users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "Get all admin users with filtering and pagination")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllAdmins(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtTo) {

        Page<AdminUserResponseDTO> adminsPage = adminUserService.getAllAdmins(
                page, size, sortBy, sortDirection, search, status, createdAtFrom, createdAtTo);

        return ResponseEntity.ok(ApiResponse.success(PaginationUtil.createPageResponse(adminsPage)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get admin user by ID")
    public ResponseEntity<ApiResponse<AdminUserResponseDTO>> getAdminById(@PathVariable Long id) {
        AdminUserResponseDTO admin = adminUserService.getAdminById(id);
        return ResponseEntity.ok(ApiResponse.success(admin));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update admin user status")
    public ResponseEntity<ApiResponse<AdminUserResponseDTO>> updateAdminStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDTO request) {
        AdminUserResponseDTO admin = adminUserService.updateAdminStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(admin));
    }
}
