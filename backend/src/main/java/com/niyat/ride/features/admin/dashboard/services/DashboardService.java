package com.niyat.ride.features.admin.dashboard.services;

import com.niyat.ride.features.admin.dashboard.dtos.DashboardSummaryDTO;
import com.niyat.ride.features.admin.dashboard.dtos.UserSummaryDTO;

public interface DashboardService {
    UserSummaryDTO getUserSummary();
    DashboardSummaryDTO getDashboardSummary();
}
