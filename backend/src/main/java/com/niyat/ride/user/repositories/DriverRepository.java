package com.niyat.ride.user.repositories;

import com.niyat.ride.user.models.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.locationtech.jts.geom.Point;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByPhoneNumber(String phoneNumber);
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    
    // PostGIS spatial queries for driver discovery
    @Query(value = """
        SELECT u.id, u.first_name, u.last_name, u.phone_number, u.email, u.is_verified, u.verified_at, 
               u.role, u.status, u.created_at, u.updated_at, d.license_number, d.license_image_path, 
               d.current_location, d.current_latitude, d.current_longitude, d.is_online, d.last_location_update
        FROM drivers d 
        JOIN users u ON d.id = u.id
        WHERE d.is_online = true 
        AND d.current_location IS NOT NULL
        AND ST_DWithin(d.current_location, ST_GeomFromText(:pickupPoint, 4326), :radiusMeters)
        ORDER BY ST_Distance(d.current_location, ST_GeomFromText(:pickupPoint, 4326))
        LIMIT :limit
        """, nativeQuery = true)
    List<Driver> findNearbyOnlineDrivers(
        @Param("pickupPoint") String pickupPoint,
        @Param("radiusMeters") double radiusMeters,
        @Param("limit") int limit
    );
    
    @Query(value = """
        SELECT u.id, u.first_name, u.last_name, u.phone_number, u.email, u.is_verified, u.verified_at, 
               u.role, u.status, u.created_at, u.updated_at, d.license_number, d.license_image_path, 
               d.current_location, d.current_latitude, d.current_longitude, d.is_online, d.last_location_update
        FROM drivers d 
        JOIN users u ON d.id = u.id
        WHERE d.is_online = true 
        AND d.current_location IS NOT NULL
        AND ST_DWithin(d.current_location, :pickupLocation, :radiusMeters)
        ORDER BY ST_Distance(d.current_location, :pickupLocation)
        """, nativeQuery = true)
    List<Driver> findDriversWithinRadius(
        @Param("pickupLocation") Point pickupLocation,
        @Param("radiusMeters") double radiusMeters
    );
    
    @Query("SELECT d FROM Driver d WHERE d.isOnline = true AND d.currentLocation IS NOT NULL")
    List<Driver> findOnlineDriversWithLocation();
    
    @Query(value = """
        SELECT COUNT(*) FROM drivers d 
        WHERE d.is_online = true 
        AND d.current_location IS NOT NULL
        AND ST_DWithin(d.current_location, ST_GeomFromText(:point, 4326), :radiusMeters)
        """, nativeQuery = true)
    long countOnlineDriversInRadius(@Param("point") String point, @Param("radiusMeters") double radiusMeters);
}