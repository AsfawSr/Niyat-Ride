package com.niyat.ride.ride.services;

import com.niyat.ride.ride.dtos.RideRequestDTO;
import com.niyat.ride.ride.models.RideRequest;

import java.math.BigDecimal;

public interface RideRequestService {

    RideRequest createRideRequest(RideRequestDTO dto, Long passengerId);

    RideRequest acceptRide(Long rideId, Long driverId);

    RideRequest rejectRide(Long rideId);

    RideRequest startTrip(Long rideId);

    RideRequest completeTrip(Long rideId);

    RideRequest cancelTrip(Long rideId, String reason);
}
