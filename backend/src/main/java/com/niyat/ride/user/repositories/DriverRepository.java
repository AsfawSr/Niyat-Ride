package com.niyat.ride.user.repositories;

import com.niyat.ride.user.models.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findByPhoneNumber(String phoneNumber);
    Optional<Driver> findByLicenseNumber(String licenseNumber);

    // Find nearby online drivers
    @Query(value = """
        SELECT d.*, u.*
        FROM drivers d
        JOIN users u ON d.id = u.id
        WHERE d.is_online = true
        AND d.current_location IS NOT NULL
        AND ST_Distance_Sphere(d.current_location, ST_GeomFromText(:pickupPoint, 4326)) <= :radiusMeters
        ORDER BY ST_Distance_Sphere(d.current_location, ST_GeomFromText(:pickupPoint, 4326))
        LIMIT :limit
        """, nativeQuery = true)
    List<Driver> findNearbyOnlineDrivers(
            @Param("pickupPoint") String pickupPoint,
            @Param("radiusMeters") double radiusMeters,
            @Param("limit") int limit
    );

    // Count nearby online drivers
    @Query(value = """
        SELECT COUNT(*)
        FROM drivers d
        JOIN users u ON d.id = u.id
        WHERE d.is_online = true
        AND d.current_location IS NOT NULL
        AND ST_Distance_Sphere(d.current_location, ST_GeomFromText(:pickupPoint, 4326)) <= :radiusMeters
        """, nativeQuery = true)
    long countOnlineDriversInRadius(
            @Param("pickupPoint") String pickupPoint,
            @Param("radiusMeters") double radiusMeters
    );

    // Get all online drivers with a location
    @Query(value = """
        SELECT d.*, u.*
        FROM drivers d
        JOIN users u ON d.id = u.id
        WHERE d.is_online = true
        AND d.current_location IS NOT NULL
        """, nativeQuery = true)
    List<Driver> findOnlineDriversWithLocation();

    // Get all drivers within a radius (without limit)
    @Query(value = """
        SELECT d.*, u.first_name, u.last_name, u.email, u.created_at, u.updated_at
        FROM drivers d
        JOIN users u ON d.id = u.id
        WHERE d.is_online = true
        AND d.current_location IS NOT NULL
        AND ST_Distance_Sphere(d.current_location, ST_GeomFromText(:pickupPoint, 4326)) <= :radiusMeters
        """, nativeQuery = true)
    List<Driver> findDriversWithinRadius(
            @Param("pickupPoint") String pickupPoint,
            @Param("radiusMeters") double radiusMeters
    );
}
