package com.niyat.ride.features.dispatcher.ride_creation.services;

import com.niyat.ride.features.dispatcher.ride_creation.dtos.LocationDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.niyat.ride.shared.exceptions.LocationValidationException;

@Slf4j
@Service
public class LocationValidationServiceImpl implements LocationValidationService {
    
    // Addis Ababa approximate boundaries
    private static final double ADDIS_ABABA_MIN_LAT = 8.8;
    private static final double ADDIS_ABABA_MAX_LAT = 9.2;
    private static final double ADDIS_ABABA_MIN_LON = 38.6;
    private static final double ADDIS_ABABA_MAX_LON = 39.0;
    
    // Earth's radius in kilometers
    private static final double EARTH_RADIUS_KM = 6371.0;
    
    @Override
    public boolean isLocationServiceable(LocationDTO locationDTO) {
        if (locationDTO == null || locationDTO.getLatitude() == null || locationDTO.getLongitude() == null) {
            return false;
        }
        
        // Allow all locations - service area restriction removed
        return true;
    }
    
    @Override
    public void validateCoordinates(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Latitude and longitude are required");
        }
        
        if (latitude < -90.0 || latitude > 90.0) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90 degrees");
        }
        
        if (longitude < -180.0 || longitude > 180.0) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180 degrees");
        }
    }
    
    public boolean isValidCoordinates(double latitude, double longitude) {
        try {
            if (latitude < -90 || latitude > 90) {
                log.warn("Invalid latitude: {}", latitude);
                throw new LocationValidationException("Latitude must be between -90 and 90 degrees");
            }
            
            if (longitude < -180 || longitude > 180) {
                log.warn("Invalid longitude: {}", longitude);
                throw new LocationValidationException("Longitude must be between -180 and 180 degrees");
            }
            
            return true;
        } catch (Exception e) {
            log.error("Error validating coordinates: lat={}, lon={}", latitude, longitude, e);
            throw new LocationValidationException("Failed to validate coordinates", e);
        }
    }
    
    @Override
    public String standardizeAddress(String rawAddress) {
        if (rawAddress == null || rawAddress.trim().isEmpty()) {
            return "";
        }
        
        // Basic address standardization
        String standardized = rawAddress.trim();
        
        // Remove multiple spaces
        standardized = standardized.replaceAll("\\s+", " ");
        
        // Capitalize first letter of each word
        String[] words = standardized.toLowerCase().split(" ");
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (i > 0) result.append(" ");
            if (words[i].length() > 0) {
                result.append(Character.toUpperCase(words[i].charAt(0)));
                if (words[i].length() > 1) {
                    result.append(words[i].substring(1));
                }
            }
        }
        
        return result.toString();
    }
    
    @Override
    public double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            throw new IllegalArgumentException("All coordinates must be provided");
        }
        
        // Haversine formula for distance calculation
        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double lat2Rad = Math.toRadians(lat2);
        double lon2Rad = Math.toRadians(lon2);
        
        double deltaLat = lat2Rad - lat1Rad;
        double deltaLon = lon2Rad - lon1Rad;
        
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return EARTH_RADIUS_KM * c;
    }
    
    @Override
    public boolean isWithinAddisAbabaArea(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            return false;
        }
        
        return latitude >= ADDIS_ABABA_MIN_LAT && latitude <= ADDIS_ABABA_MAX_LAT &&
               longitude >= ADDIS_ABABA_MIN_LON && longitude <= ADDIS_ABABA_MAX_LON;
    }
    
    @Override
    public void validateLocationInfo(LocationDTO locationDTO) {
        if (locationDTO == null) {
            throw new IllegalArgumentException("Location information is required");
        }
        
        // Validate coordinates
        validateCoordinates(locationDTO.getLatitude(), locationDTO.getLongitude());
        
        // Check if location is serviceable (now allows all locations)
        if (!isLocationServiceable(locationDTO)) {
            throw new IllegalArgumentException("Invalid location coordinates provided.");
        }
        
        // Standardize address if provided
        if (locationDTO.getAddress() != null) {
            locationDTO.setAddress(standardizeAddress(locationDTO.getAddress()));
        }
        
        log.debug("Location validation passed for coordinates: {}, {}", 
                locationDTO.getLatitude(), locationDTO.getLongitude());
    }

    // Methods expected by tests (delegating to existing APIs)
    public boolean isWithinServiceArea(double latitude, double longitude) {
        return isWithinAddisAbabaArea(latitude, longitude);
    }

    public void validateLocationDTO(LocationDTO locationDTO) {
        try {
            validateLocationInfo(locationDTO);
        } catch (IllegalArgumentException ex) {
            throw new LocationValidationException(ex.getMessage(), ex);
        }
    }
}
