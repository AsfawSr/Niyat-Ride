package com.niyat.ride.ride.services;

import com.niyat.ride.ride.models.DriverLocation;
import com.niyat.ride.ride.repositories.DriverLocationRepository;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.connection.RedisGeoCommands.GeoLocation;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DriverLocationService {

    private final GeoOperations<String, String> geoOps;
    private final StringRedisTemplate redisTemplate;
    private final DriverLocationRepository driverLocationRepository;

    public DriverLocationService(StringRedisTemplate redisTemplate, DriverLocationRepository driverLocationRepository) {
        this.redisTemplate = redisTemplate;
        this.geoOps = redisTemplate.opsForGeo();
        this.driverLocationRepository = driverLocationRepository;
    }

    // Update driver location in Redis only
    public void updateDriverLocation(Long driverId, double latitude, double longitude) {
        geoOps.add("drivers", new GeoLocation<>(driverId.toString(), new Point(longitude, latitude)));
    }

    // Find nearby drivers
    public Set<String> findNearbyDrivers(double latitude, double longitude, double radiusKm) {
        Circle circle = new Circle(new Point(longitude, latitude),
                new Distance(radiusKm, Metrics.KILOMETERS));

        var results = geoOps.radius("drivers", circle);
        if (results == null || results.getContent() == null) return Set.of();

        return results.getContent().stream()
                .map(r -> r.getContent().getName())
                .collect(Collectors.toSet());
    }

    // Batch persistence
    @Scheduled(fixedRate = 300000)
    public void persistLocationsToDb() {
        // Get all driver IDs from Redis sorted set
        Set<String> driverIds = redisTemplate.opsForZSet().range("drivers", 0, -1);
        if (driverIds == null || driverIds.isEmpty()) return;

        List<DriverLocation> locations = driverIds.stream().map(id -> {
            List<Point> points = geoOps.position("drivers", id);
            if (points == null || points.isEmpty()) return null;

            Point p = points.get(0);
            DriverLocation dl = new DriverLocation();
            dl.setDriverId(Long.parseLong(id));
            dl.setLatitude(p.getY());
            dl.setLongitude(p.getX());
            dl.setRecordedAt(java.time.LocalDateTime.now());
            return dl;
        }).filter(Objects::nonNull).collect(Collectors.toList());

        if (!locations.isEmpty()) {
            driverLocationRepository.saveAll(locations);
        }
    }

    public void persistLocationsManually() {
        persistLocationsToDb();
    }
}
