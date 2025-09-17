package com.niyat.ride.features.admin.ride_management.repositories;

import com.niyat.ride.enums.RideStatus;
import com.niyat.ride.ride.models.RideRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideManagementRepository extends JpaRepository<RideRequest, Long>, JpaSpecificationExecutor<RideRequest> {
    
    // Simple method to get all rides without complex filtering
    @Query("SELECT r FROM RideRequest r ORDER BY r.requestedAt DESC")
    Page<RideRequest> findAllRides(Pageable pageable);
    
    @Query("SELECT r FROM RideRequest r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:driverId IS NULL OR r.driverId = :driverId) AND " +
           "(:customerId IS NULL OR r.passengerId = :customerId) AND " +
           "(:fromDate IS NULL OR r.requestedAt >= :fromDate) AND " +
           "(:toDate IS NULL OR r.requestedAt <= :toDate)")
    Page<RideRequest> findWithFilters(@Param("status") RideStatus status,
                                     @Param("driverId") Long driverId,
                                     @Param("customerId") Long customerId,
                                     @Param("fromDate") LocalDateTime fromDate,
                                     @Param("toDate") LocalDateTime toDate,
                                     @Param("minAmount") BigDecimal minAmount,
                                     @Param("maxAmount") BigDecimal maxAmount,
                                     Pageable pageable);

    // Analytics queries
    @Query("SELECT COUNT(r) FROM RideRequest r")
    Long countTotalRides();

    @Query("SELECT COUNT(r) FROM RideRequest r WHERE r.status = :status")
    Long countRidesByStatus(@Param("status") RideStatus status);

    @Query("SELECT COALESCE(SUM(r.finalCost), 0) FROM RideRequest r WHERE r.status = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COALESCE(AVG(r.finalCost), 0) FROM RideRequest r WHERE r.status = 'COMPLETED'")
    BigDecimal calculateAverageRideValue();

    @Query("SELECT COALESCE(AVG(r.distanceKm), 0) FROM RideRequest r WHERE r.status = 'COMPLETED'")
    Double calculateAverageDistance();

    @Query("SELECT COALESCE(AVG(r.estimatedDurationMin), 0) FROM RideRequest r WHERE r.status = 'COMPLETED'")
    Double calculateAverageDuration();

    @Query("SELECT r.status, COUNT(r) FROM RideRequest r GROUP BY r.status")
    List<Object[]> getRideCountsByStatus();

    @Query("SELECT vt.name, COUNT(r) FROM RideRequest r " +
           "LEFT JOIN VehicleType vt ON r.vehicleTypeId = vt.id " +
           "GROUP BY vt.name")
    List<Object[]> getRideCountsByVehicleType();

    @Query("SELECT DATE(r.completedAt), COALESCE(SUM(r.finalCost), 0) FROM RideRequest r " +
           "WHERE r.status = 'COMPLETED' AND r.completedAt >= :fromDate " +
           "GROUP BY DATE(r.completedAt) ORDER BY DATE(r.completedAt)")
    List<Object[]> getDailyRevenue(@Param("fromDate") LocalDateTime fromDate);

    @Query("SELECT WEEK(r.completedAt), COALESCE(SUM(r.finalCost), 0) FROM RideRequest r " +
           "WHERE r.status = 'COMPLETED' AND r.completedAt >= :fromDate " +
           "GROUP BY WEEK(r.completedAt) ORDER BY WEEK(r.completedAt)")
    List<Object[]> getWeeklyRevenue(@Param("fromDate") LocalDateTime fromDate);

    @Query("SELECT MONTH(r.completedAt), COALESCE(SUM(r.finalCost), 0) FROM RideRequest r " +
           "WHERE r.status = 'COMPLETED' AND r.completedAt >= :fromDate " +
           "GROUP BY MONTH(r.completedAt) ORDER BY MONTH(r.completedAt)")
    List<Object[]> getMonthlyRevenue(@Param("fromDate") LocalDateTime fromDate);
}
