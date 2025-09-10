package com.niyat.ride.ride.models;

import com.niyat.ride.enums.RideStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ride_requests")
public class RideRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long passengerId;
    private Long driverId;
    private Long vehicleTypeId;
    private Long dispatcherId;

    // PostGIS fields (legacy / admin / analytics)
    @Column(name = "pickup_location", columnDefinition = "GEOMETRY(Point, 4326)")
    private Point pickupLocation;

    @Column(name = "dropoff_location", columnDefinition = "GEOMETRY(Point, 4326)")
    private Point dropoffLocation;

    // Backup coordinates for API / real-time use
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String pickupAddress;

    private Double dropoffLatitude;
    private Double dropoffLongitude;
    private String dropoffAddress;

    @Enumerated(EnumType.STRING)
    private RideStatus status;

    private BigDecimal estimatedCost;
    private BigDecimal finalCost;
    private Double distanceKm;
    private Integer estimatedDurationMin;

    private LocalDateTime requestedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;

    private String cancellationReason;
    private String notes;
}
