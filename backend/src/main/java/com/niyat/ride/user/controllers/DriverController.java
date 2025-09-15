package com.niyat.ride.user.controllers;

import com.niyat.ride.user.dtos.DriverResponseDTO;
import com.niyat.ride.user.dtos.DriverUpdateDTO;
import com.niyat.ride.user.mappers.DriverMapper;
import com.niyat.ride.user.services.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;
    private final DriverMapper driverMapper;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    // CRUD
    @GetMapping("/{id}")
    public ResponseEntity<DriverResponseDTO> getDriver(@PathVariable Long id) {
        DriverResponseDTO driver = driverService.getDriverById(id);
        if (driver != null) {
            return ResponseEntity.ok(driver);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    @GetMapping
    public ResponseEntity<List<DriverResponseDTO>> getAllDrivers() {
        List<DriverResponseDTO> drivers = driverService.getAllDrivers()
                .stream()
                .toList();
        return ResponseEntity.ok(drivers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DriverResponseDTO> updateDriver(
            @PathVariable Long id,
            @RequestBody DriverUpdateDTO updatedDTO) {

        DriverResponseDTO updatedDriver = driverService.updateDriver(id, updatedDTO);
        return ResponseEntity.ok(updatedDriver);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }

    // Toggle online status
    @PatchMapping("/{driverId}/status")
    public ResponseEntity<DriverResponseDTO> toggleOnlineStatus(
            @PathVariable Long driverId,
            @RequestParam boolean online) {

        DriverResponseDTO updatedDriver = driverService.toggleOnlineStatus(driverId, online);
        return ResponseEntity.ok(updatedDriver);
    }

    // Location
    @PatchMapping("/{driverId}/location")
    public ResponseEntity<DriverResponseDTO> updateLocation(
            @PathVariable Long driverId,
            @RequestParam double latitude,
            @RequestParam double longitude) {

        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        point.setSRID(4326);

        DriverResponseDTO updatedDriver = driverService.updateDriverLocation(driverId, point);
        return ResponseEntity.ok(updatedDriver);
    }

    //  Nearby Drivers
    @GetMapping("/nearby")
    public ResponseEntity<List<DriverResponseDTO>> findNearbyDrivers(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radiusMeters,
            @RequestParam(defaultValue = "10") int limit) {

        String wkt = String.format("POINT(%f %f)", longitude, latitude);
        List<DriverResponseDTO> nearbyDrivers = driverService.findNearbyDrivers(wkt, radiusMeters, limit);

        List<DriverResponseDTO> response = nearbyDrivers.stream()
                .toList();

        return ResponseEntity.ok(response);
    }

    //  Online Drivers
    @GetMapping("/online")
    public ResponseEntity<List<DriverResponseDTO>> getOnlineDrivers() {
        List<DriverResponseDTO> onlineDrivers = driverService.getOnlineDrivers();

        List<DriverResponseDTO> response = onlineDrivers.stream()
                .toList();

        return ResponseEntity.ok(response);
    }


    @GetMapping("/count")
    @Operation(summary = "Get total number of registered drivers")
    public ResponseEntity<Long> countDrivers() {
        long count = driverService.countDrivers();
        return ResponseEntity.ok(count);
    }
}
