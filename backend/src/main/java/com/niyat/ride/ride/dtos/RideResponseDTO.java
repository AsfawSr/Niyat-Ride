package com.niyat.ride.ride.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RideResponseDTO {
    private Long rideId;
    private String status;
}