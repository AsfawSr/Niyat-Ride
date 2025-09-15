package com.niyat.ride.features.admin.dashboard.services;

import com.niyat.ride.features.admin.dashboard.dtos.DashboardSummaryDTO;
import com.niyat.ride.features.admin.dashboard.dtos.UserSummaryDTO;
import com.niyat.ride.features.admin.dashboard.repositories.DashboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DashboardRepository dashboardRepository;

    @Override
    public UserSummaryDTO getUserSummary() {
        Long totalUsers = dashboardRepository.getTotalUsers();
        Long totalCustomers = dashboardRepository.getTotalCustomers();
        Long totalDrivers = dashboardRepository.getTotalDrivers();
        Long totalAdmins = dashboardRepository.getTotalAdmins();
        Long totalDispatchers = dashboardRepository.getTotalDispatchers();

        return new UserSummaryDTO(
            totalUsers,
            totalCustomers,
            totalDrivers,
            totalAdmins,
            totalDispatchers
        );
    }

    @Override
    public DashboardSummaryDTO getDashboardSummary() {
        Long totalRides = dashboardRepository.getTotalRides();
        var totalRevenue = dashboardRepository.getTotalRevenue();
        Long activeDrivers = dashboardRepository.getActiveDrivers();
        Long totalVehicleTypes = dashboardRepository.getTotalVehicleTypes();

        return new DashboardSummaryDTO(
            totalRides,
            totalRevenue,
            activeDrivers,
            totalVehicleTypes
        );
    }
}
