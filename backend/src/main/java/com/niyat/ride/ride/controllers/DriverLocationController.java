package com.niyat.ride.ride.controllers;

import com.niyat.ride.ride.services.DriverLocationService;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/drivers")
public class DriverLocationController {

    private final DriverLocationService locationService;

    public DriverLocationController(DriverLocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping("/update-location")
    public void updateLocation(@RequestParam Long driverId,
                               @RequestParam double latitude,
                               @RequestParam double longitude) {
        locationService.updateDriverLocation(driverId, latitude, longitude);
    }


    @GetMapping("/nearby")
    public Set<String> getNearbyDrivers(@RequestParam double latitude,
                                        @RequestParam double longitude,
                                        @RequestParam double radiusKm) {
        return locationService.findNearbyDrivers(latitude, longitude, radiusKm);
    }

    @PostMapping("/persist-locations")
    public String persistLocations() {
        locationService.persistLocationsToDb();
        return "Driver locations persisted to DB successfully!";
    }
}
