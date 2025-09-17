package com.niyat.ride.features.admin.ride_management.services;

import com.niyat.ride.enums.RideStatus;
import com.niyat.ride.features.admin.ride_management.dtos.RideResponseDTO;
import com.niyat.ride.features.admin.ride_management.dtos.RideSummaryDTO;
import com.niyat.ride.features.admin.ride_management.repositories.RideManagementRepository;
import com.niyat.ride.ride.models.RideRequest;
import com.niyat.ride.user.repositories.CustomerRepository;
import com.niyat.ride.user.repositories.DriverRepository;
import com.niyat.ride.features.admin.vehicle_type_management.repositories.VehicleTypeRepository;
import com.niyat.ride.shared.utils.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RideManagementServiceImpl implements RideManagementService {

    private final RideManagementRepository rideManagementRepository;
    private final CustomerRepository customerRepository;
    private final DriverRepository driverRepository;
    private final VehicleTypeRepository vehicleTypeRepository;

    @Override
    public Page<RideResponseDTO> getAllRides(Integer page, Integer size, String sortBy, String sortDirection,
                                           RideStatus status, Long driverId, Long customerId,
                                           LocalDateTime fromDate, LocalDateTime toDate,
                                           BigDecimal minAmount, BigDecimal maxAmount) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortDirection);
        
        // If no filters are applied, use the simple query
        if (status == null && driverId == null && customerId == null && 
            fromDate == null && toDate == null && minAmount == null && maxAmount == null) {
            Page<RideRequest> ridesPage = rideManagementRepository.findAllRides(pageable);
            return ridesPage.map(this::mapToResponseDTO);
        }
        
        // Otherwise use filtered query
        Page<RideRequest> ridesPage = rideManagementRepository.findWithFilters(
                status, driverId, customerId, fromDate, toDate, minAmount, maxAmount, pageable);
        
        return ridesPage.map(this::mapToResponseDTO);
    }

    @Override
    public Page<RideResponseDTO> getAllRideRequests(Integer page, Integer size, String sortBy, String sortDirection,
                                                  RideStatus status, Long driverId, Long customerId,
                                                  LocalDateTime fromDate, LocalDateTime toDate,
                                                  BigDecimal minAmount, BigDecimal maxAmount) {
        // For ride requests, we typically filter for REQUESTED status or all pending statuses
        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortDirection);
        Page<RideRequest> rideRequestsPage = rideManagementRepository.findWithFilters(
                status, driverId, customerId, fromDate, toDate, minAmount, maxAmount, pageable);
        
        return rideRequestsPage.map(this::mapToResponseDTO);
    }

    @Override
    public RideSummaryDTO getRidesSummary() {
        RideSummaryDTO summary = new RideSummaryDTO();
        
        // Basic counts
        summary.setTotalRidesCount(rideManagementRepository.countTotalRides());
        summary.setCompletedRidesCount(rideManagementRepository.countRidesByStatus(RideStatus.COMPLETED));
        summary.setCancelledRidesCount(rideManagementRepository.countRidesByStatus(RideStatus.CANCELLED));
        summary.setInProgressRidesCount(rideManagementRepository.countRidesByStatus(RideStatus.IN_PROGRESS));
        summary.setRequestedRidesCount(rideManagementRepository.countRidesByStatus(RideStatus.REQUESTED));
        
        // Revenue calculations
        summary.setTotalRevenue(rideManagementRepository.calculateTotalRevenue());
        summary.setAverageRideValue(rideManagementRepository.calculateAverageRideValue());
        summary.setAverageDistance(rideManagementRepository.calculateAverageDistance());
        summary.setAverageDuration(rideManagementRepository.calculateAverageDuration());
        
        // Rides by status
        Map<String, Long> ridesByStatus = new HashMap<>();
        List<Object[]> statusCounts = rideManagementRepository.getRideCountsByStatus();
        for (Object[] row : statusCounts) {
            ridesByStatus.put(row[0].toString(), (Long) row[1]);
        }
        summary.setRidesByStatus(ridesByStatus);
        
        // Rides by vehicle type
        Map<String, Long> ridesByVehicleType = new HashMap<>();
        List<Object[]> vehicleTypeCounts = rideManagementRepository.getRideCountsByVehicleType();
        for (Object[] row : vehicleTypeCounts) {
            String vehicleType = row[0] != null ? row[0].toString() : "Unknown";
            ridesByVehicleType.put(vehicleType, (Long) row[1]);
        }
        summary.setRidesByVehicleType(ridesByVehicleType);
        
        // Revenue by period (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Map<String, BigDecimal> revenueByPeriod = new HashMap<>();
        
        List<Object[]> dailyRevenue = rideManagementRepository.getDailyRevenue(thirtyDaysAgo);
        BigDecimal totalDailyRevenue = dailyRevenue.stream()
                .map(row -> (BigDecimal) row[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        revenueByPeriod.put("daily", totalDailyRevenue);
        
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Object[]> weeklyRevenue = rideManagementRepository.getWeeklyRevenue(sevenDaysAgo);
        BigDecimal totalWeeklyRevenue = weeklyRevenue.stream()
                .map(row -> (BigDecimal) row[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        revenueByPeriod.put("weekly", totalWeeklyRevenue);
        
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        List<Object[]> monthlyRevenue = rideManagementRepository.getMonthlyRevenue(oneMonthAgo);
        BigDecimal totalMonthlyRevenue = monthlyRevenue.stream()
                .map(row -> (BigDecimal) row[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        revenueByPeriod.put("monthly", totalMonthlyRevenue);
        
        summary.setRevenueByPeriod(revenueByPeriod);
        
        return summary;
    }

    @Override
    public RideResponseDTO getRideById(Long id) {
        RideRequest ride = rideManagementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found with id: " + id));
        return mapToResponseDTO(ride);
    }

    private RideResponseDTO mapToResponseDTO(RideRequest ride) {
        RideResponseDTO dto = new RideResponseDTO();
        dto.setId(ride.getId());
        dto.setPassengerId(ride.getPassengerId());
        dto.setDriverId(ride.getDriverId());
        dto.setVehicleTypeId(ride.getVehicleTypeId());
        
        // Get passenger name
        if (ride.getPassengerId() != null) {
            customerRepository.findById(ride.getPassengerId())
                    .ifPresent(customer -> dto.setPassengerName(
                            customer.getFirstName() + " " + customer.getLastName()));
        }
        
        // Get driver name
        if (ride.getDriverId() != null) {
            driverRepository.findById(ride.getDriverId())
                    .ifPresent(driver -> dto.setDriverName(
                            driver.getFirstName() + " " + driver.getLastName()));
        }
        
        // Get vehicle type name
        if (ride.getVehicleTypeId() != null) {
            vehicleTypeRepository.findById(ride.getVehicleTypeId())
                    .ifPresent(vehicleType -> dto.setVehicleTypeName(vehicleType.getName()));
        }
        
        dto.setPickupLatitude(ride.getPickupLatitude());
        dto.setPickupLongitude(ride.getPickupLongitude());
        dto.setPickupAddress(ride.getPickupAddress());
        dto.setDropoffLatitude(ride.getDropoffLatitude());
        dto.setDropoffLongitude(ride.getDropoffLongitude());
        dto.setDropoffAddress(ride.getDropoffAddress());
        dto.setStatus(ride.getStatus());
        dto.setEstimatedCost(ride.getEstimatedCost());
        dto.setFinalCost(ride.getFinalCost());
        dto.setDistanceKm(ride.getDistanceKm());
        dto.setEstimatedDurationMin(ride.getEstimatedDurationMin());
        dto.setRequestedAt(ride.getRequestedAt());
        dto.setAcceptedAt(ride.getAcceptedAt());
        dto.setStartedAt(ride.getStartedAt());
        dto.setCompletedAt(ride.getCompletedAt());
        dto.setCancelledAt(ride.getCancelledAt());
        dto.setCancellationReason(ride.getCancellationReason());
        dto.setNotes(ride.getNotes());
        
        return dto;
    }
}
