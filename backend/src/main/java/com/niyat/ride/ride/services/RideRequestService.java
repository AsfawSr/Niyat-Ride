package com.niyat.ride.ride.services;

import com.niyat.ride.ride.dtos.RideRequestDTO;
import com.niyat.ride.ride.models.RideRequest;

public interface RideRequestService {
    RideRequest saveRideRequest(RideRequest rideRequest);
    RideRequest createRideRequest(RideRequestDTO dto, Long passengerId);
}
