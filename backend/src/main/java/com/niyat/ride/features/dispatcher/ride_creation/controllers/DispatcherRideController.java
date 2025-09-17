package com.niyat.ride.features.dispatcher.ride_creation.controllers;

import com.niyat.ride.features.dispatcher.ride_creation.dtos.DispatcherRideRequestDTO;
import com.niyat.ride.features.dispatcher.ride_creation.dtos.DispatcherRideResponseDTO;
import com.niyat.ride.features.dispatcher.ride_creation.dtos.AssignDriverRequestDTO;
import com.niyat.ride.features.dispatcher.ride_creation.services.DispatcherRideService;
import com.niyat.ride.shared.utils.PaginationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/dispatcher/rides")
@RequiredArgsConstructor
@Tag(name = "Dispatcher Ride Creation", description = "Dispatcher endpoints for creating and managing rides")
public class DispatcherRideController {

    private final DispatcherRideService dispatcherRideService;

    @PostMapping
    @Operation(summary = "Create a new ride with customer handling and driver discovery")
    public ResponseEntity<DispatcherRideResponseDTO> createRide(
            @Valid @RequestBody DispatcherRideRequestDTO request) {
        
        DispatcherRideResponseDTO ride = dispatcherRideService.createRide(request, request.getDispatcherId());
        return ResponseEntity.created(URI.create("/api/dispatcher/rides/" + ride.getId()))
                .body(ride);
    }

    @PatchMapping("/{rideId}/assign-driver")
    @Operation(summary = "Assign a driver to an existing ride")
    public ResponseEntity<DispatcherRideResponseDTO> assignDriverToRide(
            @PathVariable Long rideId,
            @Valid @RequestBody AssignDriverRequestDTO request) {
        
        DispatcherRideResponseDTO ride = dispatcherRideService.assignDriverToRide(rideId, request.getDriverId());
        return ResponseEntity.ok(ride);
    }

    @GetMapping
    @Operation(summary = "Get all rides managed by dispatcher")
    public ResponseEntity<Map<String, Object>> getDispatcherRides(
            @RequestParam Long dispatcherId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "requestedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Page<DispatcherRideResponseDTO> ridesPage = dispatcherRideService.getDispatcherRides(
                dispatcherId, page, size, sortBy, sortDirection);

        return ResponseEntity.ok(PaginationUtil.createPageResponse(ridesPage));
    }

    @GetMapping("/{rideId}")
    @Operation(summary = "Get specific ride details")
    public ResponseEntity<DispatcherRideResponseDTO> getRideById(@PathVariable Long rideId) {
        DispatcherRideResponseDTO ride = dispatcherRideService.getRideById(rideId);
        return ResponseEntity.ok(ride);
    }
}
