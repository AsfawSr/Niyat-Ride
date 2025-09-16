package com.niyat.ride.features.admin.dashboard.controllers;

import com.niyat.ride.features.admin.dashboard.dtos.DashboardSummaryDTO;
import com.niyat.ride.features.admin.dashboard.dtos.UserSummaryDTO;
import com.niyat.ride.features.admin.dashboard.services.DashboardService;
import com.niyat.ride.shared.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard", description = "Dashboard endpoints for admin statistics and summaries")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/users/summary")
    @Operation(summary = "Get user statistics summary")
    public ResponseEntity<ApiResponse<UserSummaryDTO>> getUserSummary() {
        UserSummaryDTO userSummary = dashboardService.getUserSummary();
        return ResponseEntity.ok(ApiResponse.success(userSummary));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary with rides, revenue, and vehicle statistics")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getDashboardSummary() {
        DashboardSummaryDTO dashboardSummary = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.success(dashboardSummary));
    }
}
