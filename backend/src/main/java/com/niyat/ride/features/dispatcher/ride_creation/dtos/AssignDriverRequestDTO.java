package com.niyat.ride.features.dispatcher.ride_creation.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignDriverRequestDTO {
    
    @NotNull(message = "Driver ID is required")
    private Long driverId;
}
