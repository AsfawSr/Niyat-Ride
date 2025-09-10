package com.niyat.ride.ride.controllers;

import com.niyat.ride.ride.dtos.*;
import com.niyat.ride.ride.models.RideRequest;
import com.niyat.ride.ride.services.RideRequestService;
import com.niyat.ride.user.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideRequestController {

    private final RideRequestService rideService;

    @PostMapping
    public ResponseEntity<RideResponseDTO> requestRide(@RequestBody RideRequestDTO dto,
                                                       @AuthenticationPrincipal User user) {
        RideRequest ride = rideService.createRideRequest(dto, user.getId());
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name()));
    }

    @PostMapping("/{rideId}/response")
    public ResponseEntity<RideResponseDTO> respondToRide(@PathVariable Long rideId,
                                                         @RequestBody RideActionDTO actionDTO,
                                                         @AuthenticationPrincipal User driver) {
        RideRequest ride;
        if ("ACCEPT".equalsIgnoreCase(actionDTO.getAction())) {
            ride = rideService.acceptRide(rideId, driver.getId());
        } else if ("REJECT".equalsIgnoreCase(actionDTO.getAction())) {
            ride = rideService.rejectRide(rideId);
        } else {
            throw new RuntimeException("Invalid action");
        }
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name()));
    }

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

    @PostMapping("/{rideId}/complete")
    public ResponseEntity<RideResponseDTO> completeTrip(@PathVariable Long rideId,
                                                        @RequestBody CompleteTripDTO dto) {
        RideRequest ride = rideService.completeTrip(rideId, dto.getFinalCost());
        return ResponseEntity.ok(new RideResponseDTO(ride.getId(), ride.getStatus().name()));
    }
}
