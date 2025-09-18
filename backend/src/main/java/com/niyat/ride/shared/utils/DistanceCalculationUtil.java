package com.niyat.ride.shared.utils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DistanceCalculationUtil {
    
    private static final double EARTH_RADIUS_KM = 6371.0;
    
    /**
     * Calculate distance between two points using Haversine formula
     * @param lat1 Latitude of first point
     * @param lon1 Longitude of first point
     * @param lat2 Latitude of second point
     * @param lon2 Longitude of second point
     * @return Distance in kilometers
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        try {
            // Convert latitude and longitude from degrees to radians
            double lat1Rad = Math.toRadians(lat1);
            double lon1Rad = Math.toRadians(lon1);
            double lat2Rad = Math.toRadians(lat2);
            double lon2Rad = Math.toRadians(lon2);
            
            // Calculate the difference in coordinates
            double deltaLat = lat2Rad - lat1Rad;
            double deltaLon = lon2Rad - lon1Rad;
            
            // Apply Haversine formula
            double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
            
            double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            
            double distance = EARTH_RADIUS_KM * c;
            
            log.debug("Calculated distance between ({}, {}) and ({}, {}): {} km", 
                    lat1, lon1, lat2, lon2, distance);
            
            return distance;
            
        } catch (Exception e) {
            log.error("Error calculating distance between coordinates", e);
            return 0.0;
        }
    }
    
    /**
     * Validate if coordinates are within valid ranges
     * @param latitude Latitude value
     * @param longitude Longitude value
     * @return true if coordinates are valid
     */
    public static boolean areValidCoordinates(double latitude, double longitude) {
        return latitude >= -90.0 && latitude <= 90.0 && 
               longitude >= -180.0 && longitude <= 180.0;
    }
}
