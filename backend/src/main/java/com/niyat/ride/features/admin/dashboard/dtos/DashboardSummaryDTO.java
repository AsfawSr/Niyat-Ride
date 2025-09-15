package com.niyat.ride.features.admin.dashboard.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private Long totalRides;
    private BigDecimal totalRevenue;
    private Long activeDrivers;
    private Long totalVehicleTypes;
}
