package com.niyat.ride.ride.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RideRequestDTO {
    private double pickupLat;
    private double pickupLon;
    private Double dropoffLat;
    private Double dropoffLon;
    private Long vehicleTypeId;
    private BigDecimal estimatedPrice;
    private Double estimatedDistanceKm;
    private Integer estimatedDurationMin;
}

