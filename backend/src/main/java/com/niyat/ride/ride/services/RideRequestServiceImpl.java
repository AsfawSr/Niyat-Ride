package com.niyat.ride.ride.services;

import com.niyat.ride.enums.RideStatus;
import com.niyat.ride.ride.dtos.RideRequestDTO;
import com.niyat.ride.ride.models.RideRequest;
import com.niyat.ride.ride.repositories.RideRequestRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RideRequestServiceImpl implements RideRequestService {

    private final RideRequestRepository rideRequestRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public RideRequest saveRideRequest(RideRequest rideRequest) {
        return rideRequestRepository.save(rideRequest);
    }

    @Override
    public RideRequest createRideRequest(RideRequestDTO dto, Long passengerId) {
        RideRequest ride = new RideRequest();

        // passenger info
        ride.setPassengerId(passengerId);
        ride.setVehicleTypeId(dto.getVehicleTypeId());

        // pickup info
        if (dto.getPickupLat() != 0 && dto.getPickupLon() != 0) {
            ride.setPickupLocation(
                    geometryFactory.createPoint(new Coordinate(dto.getPickupLon(), dto.getPickupLat()))
            );
        }
        ride.setPickupLatitude(dto.getPickupLat());
        ride.setPickupLongitude(dto.getPickupLon());

        // dropoff info
        if (dto.getDropoffLat() != null && dto.getDropoffLon() != null) {
            ride.setDropoffLocation(
                    geometryFactory.createPoint(new Coordinate(dto.getDropoffLon(), dto.getDropoffLat()))
            );
            ride.setDropoffLatitude(dto.getDropoffLat());
            ride.setDropoffLongitude(dto.getDropoffLon());
        }


        ride.setStatus(RideStatus.IN_PROGRESS);
        ride.setRequestedAt(LocalDateTime.now());

        return rideRequestRepository.save(ride);
    }
}
