//package com.niyat.ride.ride.services;
//
//import lombok.RequiredArgsConstructor;
//import org.locationtech.jts.geom.Point;
//import org.springframework.data.geo.Distance;
//import org.springframework.data.geo.GeoResults;
//import org.springframework.data.geo.Metrics;
//import org.springframework.data.redis.connection.RedisGeoCommands;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.domain.geo.GeoReference;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class DriverLocationService {
//
//    private final String DRIVER_LOCATIONS_KEY = "drivers:locations";
//    private final RedisTemplate<String, String> redisTemplate;
//
//    public void updateDriverLocation(Long driverId, Long lat, Long lon) {
//        redisTemplate.opsForGeo()
//                .add(DRIVER_LOCATIONS_KEY, new Point(lon, lat), driverId.toString());
//    }
//
//    public List<String> findNearbyDrivers(double lat, double lon, double radiusKm) {
//        GeoResults<RedisGeoCommands.GeoLocation<String>> results =
//                redisTemplate.opsForGeo()
//                        .search(DRIVER_LOCATIONS_KEY,
//                                GeoReference.fromCoordinate(lon, lat),
//                                new Distance(radiusKm, Metrics.KILOMETERS));
//
//        if (results == null) return List.of();
//        return results.getContent().stream()
//                .map(r -> r.getContent().getName())
//                .toList();
//    }
//}
//
