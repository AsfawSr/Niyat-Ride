package com.niyat.ride.shared.services;

import com.niyat.ride.enums.RideStatus;
import com.niyat.ride.user.models.Driver;
import com.niyat.ride.user.repositories.DriverRepository;
import com.niyat.ride.ride.repositories.RideRequestRepository;
import com.niyat.ride.features.admin.vehicle_type_management.repositories.VehicleTypeRepository;
import com.niyat.ride.shared.dtos.NearbyDriverDTO;
import com.niyat.ride.shared.exceptions.DriverDiscoveryException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.GeometryFactory;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DriverDiscoveryServiceImpl implements DriverDiscoveryService {
    
    private final DriverRepository driverRepository;
    private final RideRequestRepository rideRequestRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    
    // PostGIS geometry factory for creating spatial objects
    private final GeometryFactory geometryFactory = new GeometryFactory();
    
    // Default search radius in kilometers and meters
    private static final double DEFAULT_SEARCH_RADIUS_KM = 5.0;
    private static final double DEFAULT_SEARCH_RADIUS_METERS = DEFAULT_SEARCH_RADIUS_KM * 1000;
    private static final int DEFAULT_MAX_DRIVERS = 10;
    private static final Double AVERAGE_SPEED_KMH = 30.0; // Average city driving speed
    
    @Override
    public List<NearbyDriverDTO> findNearbyDrivers(Double pickupLatitude, Double pickupLongitude, 
                                                   Double radiusKm, Long vehicleTypeId, Integer maxResults) {
        
        log.info("Searching for drivers near ({}, {}) within {}km radius", 
                pickupLatitude, pickupLongitude, radiusKm);
        
        try {
            // Use PostGIS spatial queries for efficient driver discovery
            String pickupPoint = String.format("POINT(%f %f)", pickupLongitude, pickupLatitude);
            double radiusMeters = (radiusKm != null ? radiusKm : DEFAULT_SEARCH_RADIUS_KM) * 1000;
            int limit = maxResults != null ? maxResults : DEFAULT_MAX_DRIVERS;
            
            List<Driver> nearbyDrivers = driverRepository.findNearbyOnlineDrivers(
                pickupPoint, radiusMeters, limit);
            
            log.info("Found {} nearby drivers using PostGIS", nearbyDrivers.size());
            
            return nearbyDrivers.stream()
                .map(driver -> mapToNearbyDriverDTO(driver, pickupLatitude, pickupLongitude))
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error finding nearby drivers with PostGIS, falling back to basic search", e);
            throw new DriverDiscoveryException("Failed to find nearby drivers", e);
        }
    }
    
    private NearbyDriverDTO mapToNearbyDriverDTO(Driver driver, double pickupLatitude, double pickupLongitude) {
        NearbyDriverDTO dto = new NearbyDriverDTO();
        dto.setDriverId(driver.getId());
        dto.setFirstName(driver.getFirstName());
        dto.setLastName(driver.getLastName());
        dto.setPhoneNumber(driver.getPhoneNumber());
        dto.setRating(BigDecimal.valueOf(4.5)); // TODO: Get actual rating
        dto.setStatus("AVAILABLE");
        
        // Use actual driver coordinates
        dto.setCurrentLatitude(driver.getCurrentLatitude());
        dto.setCurrentLongitude(driver.getCurrentLongitude());
        
        // Calculate distance using actual driver location
        double distance = calculateDistanceFromDriver(driver, pickupLatitude, pickupLongitude);
        dto.setDistanceKm(distance);
        dto.setEstimatedArrivalMinutes(calculateEstimatedArrival(distance));
        
        // Set vehicle information
        NearbyDriverDTO.VehicleInfoDTO vehicleInfo = new NearbyDriverDTO.VehicleInfoDTO();
        vehicleInfo.setVehicleType("Standard");
        vehicleInfo.setVehicleModel("Toyota Corolla");
        vehicleInfo.setPlateNumber("3-" + String.format("%05d", driver.getId()));
        vehicleInfo.setCapacity(4);
        vehicleInfo.setColor("White");
        dto.setVehicle(vehicleInfo);
        
        return dto;
    }
    
    private double calculateDistanceFromDriver(Driver driver, double pickupLatitude, double pickupLongitude) {
        // If driver has PostGIS location, use that; otherwise fall back to lat/lon
        if (driver.getCurrentLatitude() != null && driver.getCurrentLongitude() != null) {
            return calculateDistance(
                driver.getCurrentLatitude(), driver.getCurrentLongitude(),
                pickupLatitude, pickupLongitude
            );
        }
        return 0.0; // Default if no location available
    }

    private int calculateEstimatedArrival(double distanceKm) {
        double timeHours = distanceKm / AVERAGE_SPEED_KMH;
        return (int) Math.ceil(timeHours * 60);
    }
    
    @Override
    public List<NearbyDriverDTO> findNearbyDrivers(Double pickupLatitude, Double pickupLongitude) {
        return findNearbyDrivers(pickupLatitude, pickupLongitude, DEFAULT_SEARCH_RADIUS_KM, null, DEFAULT_MAX_DRIVERS);
    }
    
    @Override
    public boolean isDriverAvailable(Long driverId) {
        // Check if driver has any active rides
        List<RideStatus> activeStatuses = List.of(RideStatus.ACCEPTED, RideStatus.IN_PROGRESS);
        return rideRequestRepository.findByDriverIdAndStatusIn(driverId, activeStatuses).isEmpty();
    }
    
    @Override
    public Integer calculateEstimatedArrival(Double driverLatitude, Double driverLongitude,
                                           Double pickupLatitude, Double pickupLongitude) {
        
        double distanceKm = calculateDistance(driverLatitude, driverLongitude, pickupLatitude, pickupLongitude);
        double timeHours = distanceKm / AVERAGE_SPEED_KMH;
        return (int) Math.ceil(timeHours * 60); // Convert to minutes and round up
    }
    
    private boolean hasValidLocation(Driver driver) {
        // TODO: Check if driver has current location coordinates
        // For now, assume all drivers have valid locations
        return true;
    }
    
    private boolean isWithinRadius(Driver driver, Double pickupLat, Double pickupLon, Double radiusKm) {
        if (driver.getCurrentLatitude() == null || driver.getCurrentLongitude() == null) {
            return false;
        }
        
        double distance = calculateDistance(driver.getCurrentLatitude(), driver.getCurrentLongitude(), pickupLat, pickupLon);
        return distance <= radiusKm;
    }
    
    private boolean matchesVehicleType(Driver driver, Long vehicleTypeId) {
        // TODO: Implement vehicle type matching based on driver's vehicle
        // For now, assume all drivers match any vehicle type
        return true;
    }
    
    
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        // Haversine formula
        final double R = 6371.0; // Earth's radius in km
        
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
        
        return R * c;
    }
    
}
