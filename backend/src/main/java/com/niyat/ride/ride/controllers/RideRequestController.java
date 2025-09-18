package com.niyat.ride.ride.controllers;

import com.niyat.ride.enums.RideStatus;
import com.niyat.ride.ride.dtos.*;
import com.niyat.ride.ride.models.RideRequest;
import com.niyat.ride.ride.repositories.RideRequestRepository;
import com.niyat.ride.ride.services.RideRequestService;
import com.niyat.ride.user.models.Driver;
import com.niyat.ride.user.repositories.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideRequestController {

    private final RideRequestService rideService;
    private final RideRequestRepository rideRequestRepository;
    private final DriverRepository driverRepository;


    // request a ride → automatically assign nearest driver
    @PostMapping
    public ResponseEntity<RideResponseDTO> requestRide(@RequestBody RideRequestDTO dto,
                                                       @RequestParam Long passengerId) {
        RideRequest ride = rideService.createRideRequest(dto, passengerId);
        Driver driver = driverRepository.getReferenceById(ride.getDriverId());
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name(),driver.getFirstName(),driver.getLastName(),ride.getDriverId(),driver.getPhoneNumber()));
    }

    // passenger ride CONFIRM or CANCEL
    @PostMapping("/{rideId}/response")
    public ResponseEntity<RideResponseDTO> confirmRide(@PathVariable Long rideId,
                                                       @RequestBody RideActionDTO confirmDto) {
        RideRequest ride = rideRequestRepository.findById(rideId).orElseThrow();
        if ("CONFIRM".equalsIgnoreCase(confirmDto.getAction())) {
            ride.setStatus(RideStatus.CONFIRMED);
        } else if ("CANCEL".equalsIgnoreCase(confirmDto.getAction())) {
            ride = rideService.cancelTrip(rideId, "Passenger cancelled before starting");
        } else {
            throw new RuntimeException("Invalid action");
        }
        rideRequestRepository.save(ride);
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name(),null,null,null,null));
    }

    // trip management (START / CANCEL)
    @PostMapping("/{rideId}/trip")
    public ResponseEntity<RideResponseDTO> manageTrip(@PathVariable Long rideId,
                                                      @RequestBody TripActionDTO actionDTO) {
        RideRequest ride;
        if ("START".equalsIgnoreCase(actionDTO.getAction())) {
            ride = rideService.startTrip(rideId);
        } else if ("CANCEL".equalsIgnoreCase(actionDTO.getAction())) {
            ride = rideService.cancelTrip(rideId, actionDTO.getReason());
        } else {
            throw new RuntimeException("Invalid action");
        }
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name(),null,null,null,null));
    }

    // complete trip
    @PostMapping("/{rideId}/complete")
    public ResponseEntity<RideResponseDTO> completeTrip(@PathVariable Long rideId) {
        RideRequest ride = rideService.completeTrip(rideId);
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name(),null,null,null,null));
    }
    // Fetch final cost for a ride
    @GetMapping("/{rideId}/fare")
    public ResponseEntity<BigDecimal> getFinalFare(@PathVariable Long rideId) {
        RideRequest ride = rideRequestRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getStatus() != RideStatus.COMPLETED) {
            throw new RuntimeException("Ride is not completed yet");
        }

        return ResponseEntity.ok(ride.getFinalCost());
    }

}
