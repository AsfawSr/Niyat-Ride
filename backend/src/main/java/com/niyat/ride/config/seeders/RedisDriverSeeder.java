package com.niyat.ride.config.seeders;


import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.data.redis.connection.RedisGeoCommands.GeoLocation;

import java.util.Arrays;
import java.util.List;

@Component
public class RedisDriverSeeder implements CommandLineRunner {

    private final StringRedisTemplate redisTemplate;
    private final GeoOperations<String, String> geoOps;

    public RedisDriverSeeder(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.geoOps = redisTemplate.opsForGeo();
    }

    @Override
    public void run(String... args) throws Exception {
        // Clear existing drivers
        redisTemplate.delete("drivers");

        // Define driver IDs and coordinates (longitude, latitude)
        List<DriverSeed> drivers = Arrays.asList(
                new DriverSeed("1", 39.47044640779495, 13.488499639013533),
                new DriverSeed("2", 39.47044640779495, 13.488499639013533),
                new DriverSeed("3", 39.47044640779495, 13.488499639013533),
                new DriverSeed("4", 39.47044640779495, 13.488499639013533),
                new DriverSeed("5", 39.47044640779495, 13.488499639013533),
                new DriverSeed("6", 39.47044640779495, 13.488499639013533),
                new DriverSeed("7", 39.47044640779495, 13.488499639013533),
                new DriverSeed("8", 39.47044640779495, 13.488499639013533)
        );

        // Add to Redis
        for (DriverSeed driver : drivers) {
            geoOps.add("drivers", new GeoLocation<>(driver.id, new org.springframework.data.geo.Point(driver.longitude, driver.latitude)));
        }

        System.out.println("✅ Seeded drivers into Redis successfully!");
    }

    // Helper class
    private static class DriverSeed {
        String id;
        double longitude;
        double latitude;

        DriverSeed(String id, double longitude, double latitude) {
            this.id = id;
            this.longitude = longitude;
            this.latitude = latitude;
        }
    }
}
