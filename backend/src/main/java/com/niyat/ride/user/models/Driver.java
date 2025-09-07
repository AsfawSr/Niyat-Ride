package com.niyat.ride.user.models;

import com.niyat.ride.enums.Role;
import com.niyat.ride.enums.AccountStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.locationtech.jts.geom.Point;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "drivers")
public class Driver extends User {

    // License info
    @Column(unique = true, nullable = false)
    private String licenseNumber;

    @Column(name = "license_expiration_date")
    private LocalDate licenseExpiration;

    @Override
    @Column(nullable = true)
    public String getEmail() {
        return super.getEmail();
    }

    // Vehicle info
    @Column(name = "vehicle_model", nullable = false)
    private String vehicleModel;

    @Column(name = "vehicle_plate_number", nullable = false)
    private String vehiclePlateNumber;

    // Licence images as Base64
    @Column(name = "front_licence_image", columnDefinition = "LONGTEXT")
    private String frontLicenceImage;

    @Column(name = "back_licence_image", columnDefinition = "LONGTEXT")
    private String backLicenceImage;

    // PostGIS spatial column for current location
    @Column(name = "current_location", columnDefinition = "POINT SRID 4326")
    private Point currentLocation;

    // Backup coordinates for compatibility
    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;

    @Column(name = "is_online")
    private Boolean isOnline = false;

    @Column(name = "last_location_update")
    private LocalDateTime lastLocationUpdate;

    // Account status
    @Column(name = "status")
    private AccountStatus status;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Driver() {
        super.setRole(Role.DRIVER);
    }
}
