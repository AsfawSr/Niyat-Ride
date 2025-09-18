package com.niyat.ride.ride.services;

import com.niyat.ride.ride.dtos.RideRequestDTO;
import com.niyat.ride.ride.models.RideRequest;
import com.niyat.ride.enums.RideStatus;
import com.niyat.ride.ride.repositories.RideRequestRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RideRequestServiceImpl implements RideRequestService {

    private final RideRequestRepository rideRepository;
    private final DriverLocationService driverLocationService;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    @Transactional
    public RideRequest createRideRequest(RideRequestDTO dto, Long passengerId) {
        RideRequest ride = new RideRequest();
        ride.setPassengerId(passengerId);

        // pickup & dropoff
        ride.setPickupLocation(geometryFactory.createPoint(new Coordinate(dto.getPickupLon(), dto.getPickupLat())));
        if (dto.getDropoffLat() != null && dto.getDropoffLon() != null) {
            ride.setDropoffLocation(geometryFactory.createPoint(new Coordinate(dto.getDropoffLon(), dto.getDropoffLat())));
        }

        ride.setPickupLatitude(dto.getPickupLat());
        ride.setPickupLongitude(dto.getPickupLon());
        ride.setDropoffLatitude(dto.getDropoffLat());
        ride.setDropoffLongitude(dto.getDropoffLon());

        // estimated info (from Google Maps)
        ride.setEstimatedCost(dto.getEstimatedPrice());
        ride.setDistanceKm(dto.getEstimatedDistanceKm());
        ride.setEstimatedDurationMin(dto.getEstimatedDurationMin());

        // initial status
        ride.setStatus(RideStatus.ACCEPTED);
        ride.setRequestedAt(LocalDateTime.now());

        // assign driver
        Set<String> nearbyDrivers = driverLocationService.findNearbyDrivers(dto.getPickupLat(), dto.getPickupLon(), 5.0);
        if (nearbyDrivers.isEmpty()) throw new RuntimeException("No nearby drivers available");
        Long assignedDriverId = Long.parseLong(nearbyDrivers.iterator().next());
        ride.setDriverId(assignedDriverId);

        return rideRepository.save(ride);
    }

    @Override
    @Transactional
    public RideRequest startTrip(Long rideId) {
        RideRequest ride = rideRepository.findById(rideId).orElseThrow(() -> new RuntimeException("Ride not found"));
        if (ride.getStatus() != RideStatus.CONFIRMED)
            throw new RuntimeException("Ride is not CONFIRMED");

        ride.setStatus(RideStatus.IN_PROGRESS);
        ride.setStartedAt(LocalDateTime.now());

        return rideRepository.save(ride);
    }

    @Override
    @Transactional
    public RideRequest completeTrip(Long rideId) {
        RideRequest ride = rideRepository.findById(rideId).orElseThrow(() -> new RuntimeException("Ride not found"));
        if (ride.getStatus() != RideStatus.IN_PROGRESS)
            throw new RuntimeException("Ride is not IN_PROGRESS");

        // calculate actual fare using Redis path
        double finalFareValue = driverLocationService.calculateFareAndCleanup(rideId);
        BigDecimal finalFare = BigDecimal.valueOf(finalFareValue);

        ride.setFinalCost(finalFare);
        ride.setStatus(RideStatus.COMPLETED);
        ride.setCompletedAt(LocalDateTime.now());

        return rideRepository.save(ride);
    }

    @Override
    @Transactional
    public RideRequest cancelTrip(Long rideId, String reason) {
        RideRequest ride = rideRepository.findById(rideId).orElseThrow(() -> new RuntimeException("Ride not found"));
        if (ride.getStatus() == RideStatus.COMPLETED || ride.getStatus() == RideStatus.CANCELLED)
            throw new RuntimeException("Cannot cancel completed or cancelled ride");

        ride.setStatus(RideStatus.CANCELLED);
        ride.setCancellationReason(reason);
        ride.setCancelledAt(LocalDateTime.now());

        return rideRepository.save(ride);
    }
}
