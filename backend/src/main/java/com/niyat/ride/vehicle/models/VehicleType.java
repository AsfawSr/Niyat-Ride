package com.niyat.ride.vehicle.models;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "vehicle_types")
public class VehicleType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;
    private String image;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerKm;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Soft delete functionality
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    private Integer capacity;
    private String features;
}
