package com.niyat.ride.features.admin.user_management.controllers;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.features.admin.user_management.dtos.CustomerUserResponseDTO;
import com.niyat.ride.features.admin.user_management.dtos.StatusUpdateRequestDTO;
import com.niyat.ride.features.admin.user_management.services.CustomerUserService;
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
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
@Tag(name = "Customer User Management", description = "Admin endpoints for managing customer users")
public class CustomerUserController {

    private final CustomerUserService customerUserService;

    @GetMapping
    @Operation(summary = "Get all customer users with filtering and pagination")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllCustomers(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtTo) {

        Page<CustomerUserResponseDTO> customersPage = customerUserService.getAllCustomers(
                page, size, sortBy, sortDirection, search, status, createdAtFrom, createdAtTo);

        return ResponseEntity.ok(ApiResponse.success(PaginationUtil.createPageResponse(customersPage)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer user by ID")
    public ResponseEntity<ApiResponse<CustomerUserResponseDTO>> getCustomerById(@PathVariable Long id) {
        CustomerUserResponseDTO customer = customerUserService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success(customer));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update customer user status")
    public ResponseEntity<ApiResponse<CustomerUserResponseDTO>> updateCustomerStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDTO request) {
        CustomerUserResponseDTO customer = customerUserService.updateCustomerStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(customer));
    }
}
