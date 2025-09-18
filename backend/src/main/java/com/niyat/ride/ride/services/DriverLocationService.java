package com.niyat.ride.ride.services;

import com.niyat.ride.ride.models.DriverLocation;
import com.niyat.ride.ride.repositories.DriverLocationRepository;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands.GeoLocation;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DriverLocationService {

    private final GeoOperations<String, String> geoOps;
    private final StringRedisTemplate redisTemplate;
    private final DriverLocationRepository driverLocationRepository;

    private static final double BASE_FARE = 100.0; // Birr
    private static final double PER_KM_RATE = 10.0;

    public DriverLocationService(StringRedisTemplate redisTemplate,
                                 DriverLocationRepository driverLocationRepository) {
        this.redisTemplate = redisTemplate;
        this.geoOps = redisTemplate.opsForGeo();
        this.driverLocationRepository = driverLocationRepository;
    }

    // Update driver current location in Redis GEO index (for nearby driver queries)
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

    // Save location update into a ride-specific list (called every 2 sec from mobile)
    public void saveRideLocation(Long rideId, double latitude, double longitude) {
        String key = "ride:" + rideId + ":locations";
        String value = latitude + "," + longitude;
        redisTemplate.opsForList().rightPush(key, value);
    }

    // Calculate final fare and cleanup Redis
    public double calculateFareAndCleanup(Long rideId) {
        String key = "ride:" + rideId + ":locations";
        List<String> coords = redisTemplate.opsForList().range(key, 0, -1);

        if (coords == null || coords.size() < 2) {
            redisTemplate.delete(key);
            return BASE_FARE;
        }

        double totalDistanceKm = 0.0;
        for (int i = 1; i < coords.size(); i++) {
            String[] prev = coords.get(i - 1).split(",");
            String[] curr = coords.get(i).split(",");

            double lat1 = Double.parseDouble(prev[0]);
            double lon1 = Double.parseDouble(prev[1]);
            double lat2 = Double.parseDouble(curr[0]);
            double lon2 = Double.parseDouble(curr[1]);

            totalDistanceKm += haversine(lat1, lon1, lat2, lon2);
        }

        redisTemplate.delete(key);
        return BASE_FARE + (PER_KM_RATE * totalDistanceKm);
    }

    // Haversine formula
    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    }

    // Persist all drivers’ latest location into DB every 5 min
    @Scheduled(fixedRate = 300000)
    public void persistLocationsToDb() {
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
}
