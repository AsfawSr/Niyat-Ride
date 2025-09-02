package com.niyat.ride.features.admin.user_management.repositories;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.user.models.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface DriverUserRepository extends JpaRepository<Driver, Long>, JpaSpecificationExecutor<Driver> {
    
    @Query(value = "SELECT d.* FROM drivers d " +
                   "JOIN users u ON d.id = u.id " +
                   "WHERE (:search IS NULL OR " +
                   "u.first_name ILIKE CONCAT('%', :search, '%') OR " +
                   "u.last_name ILIKE CONCAT('%', :search, '%') OR " +
                   "u.email ILIKE CONCAT('%', :search, '%') OR " +
                   "u.phone_number ILIKE CONCAT('%', :search, '%') OR " +
                   "d.license_number ILIKE CONCAT('%', :search, '%')) AND " +
                   "(:status IS NULL OR u.status = :status) AND " +
                   "(:createdAtFrom IS NULL OR u.created_at >= :createdAtFrom) AND " +
                   "(:createdAtTo IS NULL OR u.created_at <= :createdAtTo)",
           countQuery = "SELECT COUNT(*) FROM drivers d " +
                        "JOIN users u ON d.id = u.id " +
                        "WHERE (:search IS NULL OR " +
                        "u.first_name ILIKE CONCAT('%', :search, '%') OR " +
                        "u.last_name ILIKE CONCAT('%', :search, '%') OR " +
                        "u.email ILIKE CONCAT('%', :search, '%') OR " +
                        "u.phone_number ILIKE CONCAT('%', :search, '%') OR " +
                        "d.license_number ILIKE CONCAT('%', :search, '%')) AND " +
                        "(:status IS NULL OR u.status = :status) AND " +
                        "(:createdAtFrom IS NULL OR u.created_at >= :createdAtFrom) AND " +
                        "(:createdAtTo IS NULL OR u.created_at <= :createdAtTo)",
           nativeQuery = true)
    Page<Driver> findWithFilters(@Param("search") String search,
                               @Param("status") AccountStatus status,
                               @Param("createdAtFrom") LocalDateTime createdAtFrom,
                               @Param("createdAtTo") LocalDateTime createdAtTo,
                               Pageable pageable);
}
