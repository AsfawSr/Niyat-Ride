package com.niyat.ride.ride.controllers;

import com.niyat.ride.ride.dtos.RideRequestDTO;
import com.niyat.ride.ride.models.RideRequest;
import com.niyat.ride.ride.services.RideRequestService;
import com.niyat.ride.user.models.User;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideRequestController {

    private final RideRequestService rideRequestService;

    @PostMapping("/request")
    public ResponseEntity<RideRequest> requestRide(@RequestBody RideRequestDTO dto,
                                                   @AuthenticationPrincipal User user) {
        RideRequest rideRequest = rideRequestService.createRideRequest(dto, user.getId());
        return ResponseEntity.ok(rideRequest);
    }

}

