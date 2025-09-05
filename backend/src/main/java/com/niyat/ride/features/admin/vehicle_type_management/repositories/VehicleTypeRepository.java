package com.niyat.ride.features.admin.vehicle_type_management.repositories;

import com.niyat.ride.vehicle.models.VehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long>, JpaSpecificationExecutor<VehicleType> {
    
    @Query("SELECT vt FROM VehicleType vt WHERE vt.deletedAt IS NULL")
    Page<VehicleType> findAllActive(Pageable pageable);
    
    @Query(value = "SELECT * FROM vehicle_types vt " +
                   "WHERE vt.deleted_at IS NULL AND " +
                   "(:search IS NULL OR vt.name ILIKE CONCAT('%', :search, '%') OR vt.description ILIKE CONCAT('%', :search, '%')) AND " +
                   "(:isActive IS NULL OR vt.is_active = :isActive)",
           countQuery = "SELECT COUNT(*) FROM vehicle_types vt " +
                        "WHERE vt.deleted_at IS NULL AND " +
                        "(:search IS NULL OR vt.name ILIKE CONCAT('%', :search, '%') OR vt.description ILIKE CONCAT('%', :search, '%')) AND " +
                        "(:isActive IS NULL OR vt.is_active = :isActive)",
           nativeQuery = true)
    Page<VehicleType> findWithFilters(@Param("search") String search,
                                     @Param("isActive") Boolean isActive,
                                     Pageable pageable);
    
    @Query("SELECT vt FROM VehicleType vt WHERE vt.deletedAt IS NULL AND vt.id = :id")
    Optional<VehicleType> findByIdActive(@Param("id") Long id);
    
    @Query("SELECT vt FROM VehicleType vt WHERE vt.deletedAt IS NULL AND vt.isActive = true")
    List<VehicleType> findAllActiveTypes();
    
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM RideRequest r WHERE r.vehicleTypeId = :vehicleTypeId")
    boolean hasActiveRides(@Param("vehicleTypeId") Long vehicleTypeId);
    
    Optional<VehicleType> findByNameAndDeletedAtIsNull(String name);
}
