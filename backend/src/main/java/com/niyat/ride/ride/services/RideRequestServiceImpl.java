package com.niyat.ride.ride.services;

import com.niyat.ride.ride.dtos.RideRequestDTO;
import com.niyat.ride.ride.models.RideRequest;
import com.niyat.ride.enums.RideStatus;
import com.niyat.ride.ride.repositories.RideRequestRepository;
import com.niyat.ride.ride.services.DriverLocationService;
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
//        ride.setVehicleTypeId(dto.getVehicleTypeId());

        // Set pickup & dropoff locations
        ride.setPickupLocation(geometryFactory.createPoint(new Coordinate(dto.getPickupLon(), dto.getPickupLat())));
        if (dto.getDropoffLat() != null && dto.getDropoffLon() != null) {
            ride.setDropoffLocation(geometryFactory.createPoint(
                    new Coordinate(dto.getDropoffLon(), dto.getDropoffLat())
            ));
        }

        // Backup coordinates
        ride.setPickupLatitude(dto.getPickupLat());
        ride.setPickupLongitude(dto.getPickupLon());
        ride.setDropoffLatitude(dto.getDropoffLat());
        ride.setDropoffLongitude(dto.getDropoffLon());

        // Estimated info
        ride.setEstimatedCost(dto.getEstimatedPrice());
        ride.setDistanceKm(dto.getEstimatedDistanceKm());
        ride.setEstimatedDurationMin(dto.getEstimatedDurationMin());


        // Initial status
        ride.setStatus(RideStatus.ACCEPTED);
        ride.setRequestedAt(LocalDateTime.now());

        // Automatic driver assignment
        Set<String> nearbyDrivers = driverLocationService.findNearbyDrivers(dto.getPickupLat(), dto.getPickupLon(), 5.0); // 5 km radius
        if (nearbyDrivers.isEmpty()) {
            throw new RuntimeException("No nearby drivers available");
        }
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
