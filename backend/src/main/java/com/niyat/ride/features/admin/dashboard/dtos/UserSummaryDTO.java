package com.niyat.ride.features.admin.dashboard.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private Long totalUsers;
    private Long totalCustomers;
    private Long totalDrivers;
    private Long totalAdmins;
    private Long totalDispatchers;
}
