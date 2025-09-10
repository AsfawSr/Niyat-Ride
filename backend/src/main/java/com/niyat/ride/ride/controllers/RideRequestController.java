package com.niyat.ride.ride.controllers;

import com.niyat.ride.ride.dtos.*;
import com.niyat.ride.ride.models.RideRequest;
import com.niyat.ride.ride.services.RideRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideRequestController {

    private final RideRequestService rideService;

    // Request a ride
    @PostMapping
    public ResponseEntity<RideResponseDTO> requestRide(@RequestBody RideRequestDTO dto,
                                                       @RequestParam Long passengerId) {
        RideRequest ride = rideService.createRideRequest(dto, passengerId);
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name()));
    }

    // Driver response (ACCEPT/REJECT)
    @PostMapping("/{rideId}/response")
    public ResponseEntity<RideResponseDTO> respondToRide(@PathVariable Long rideId,
                                                         @RequestBody RideActionDTO actionDTO,
                                                         @RequestParam Long driverId) {
        RideRequest ride;
        if ("ACCEPT".equalsIgnoreCase(actionDTO.getAction())) {
            ride = rideService.acceptRide(rideId, driverId);
        } else if ("REJECT".equalsIgnoreCase(actionDTO.getAction())) {
            ride = rideService.rejectRide(rideId);
        } else {
            throw new RuntimeException("Invalid action");
        }
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name()));
    }

    // Trip management (START / CANCEL)
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
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name()));
    }

    // Complete trip
    @PostMapping("/{rideId}/complete")
    public ResponseEntity<RideResponseDTO> completeTrip(@PathVariable Long rideId,
                                                        @RequestBody CompleteTripDTO dto) {
        RideRequest ride = rideService.completeTrip(rideId, dto.getFinalCost());
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name()));
    }
}
