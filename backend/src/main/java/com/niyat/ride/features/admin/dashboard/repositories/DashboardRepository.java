package com.niyat.ride.features.admin.dashboard.repositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public class DashboardRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    public Long getTotalUsers() {
        return ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM users").getSingleResult()).longValue();
    }
    
    public Long getTotalCustomers() {
        return ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM customers").getSingleResult()).longValue();
    }
    
    public Long getTotalDrivers() {
        return ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM drivers").getSingleResult()).longValue();
    }
    
    public Long getTotalAdmins() {
        return ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM admins").getSingleResult()).longValue();
    }
    
    public Long getTotalDispatchers() {
        return ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM dispatchers").getSingleResult()).longValue();
    }
    
    public Long getTotalRides() {
        return ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM ride_requests").getSingleResult()).longValue();
    }
    
    public BigDecimal getTotalRevenue() {
        Object result = entityManager.createNativeQuery("SELECT COALESCE(SUM(final_cost), 0) FROM ride_requests WHERE status = 'COMPLETED'").getSingleResult();
        return result instanceof BigDecimal ? (BigDecimal) result : BigDecimal.valueOf(((Number) result).doubleValue());
    }
    
    public Long getActiveDrivers() {
        return ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM drivers d JOIN users u ON d.id = u.id WHERE u.status = 'ACTIVE'").getSingleResult()).longValue();
    }
    
    public Long getTotalVehicleTypes() {
        return ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM vehicle_types WHERE deleted_at IS NULL").getSingleResult()).longValue();
    }
}
