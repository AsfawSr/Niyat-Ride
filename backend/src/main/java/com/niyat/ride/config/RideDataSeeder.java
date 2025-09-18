package com.niyat.ride.config;

import com.niyat.ride.ride.models.RideRequest;
import com.niyat.ride.ride.repositories.RideRequestRepository;
import com.niyat.ride.user.repositories.CustomerRepository;
import com.niyat.ride.user.repositories.DriverRepository;
import com.niyat.ride.dispatcher.repositories.DispatcherRepository;
import com.niyat.ride.features.admin.vehicle_type_management.repositories.VehicleTypeRepository;
import com.niyat.ride.shared.services.RideCostCalculationService;
import com.niyat.ride.enums.RideStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class RideDataSeeder {
    
    private final RideRequestRepository rideRequestRepository;
    private final CustomerRepository customerRepository;
    private final DriverRepository driverRepository;
    private final DispatcherRepository dispatcherRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final RideCostCalculationService rideCostCalculationService;
    
    private final Random random = new Random();
    
    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        seedRides();
    }
    
    void seedRides() {
        if (rideRequestRepository.count() > 20) {
            log.info("Ride seeding skipped: rides already exist (count > 20)");
            return;
        }
        
        log.info("Seeding rides for demo...");
        
        // Get available entities
        var customers = customerRepository.findAll();
        var drivers = driverRepository.findAll();
        var dispatchers = dispatcherRepository.findAll();
        var vehicleTypes = vehicleTypeRepository.findAll();
        
        if (customers.isEmpty() || drivers.isEmpty() || dispatchers.isEmpty() || vehicleTypes.isEmpty()) {
            log.warn("Cannot seed rides: missing required entities (customers, drivers, dispatchers, or vehicle types)");
            return;
        }
        
        // Demo ride locations in Addis Ababa
        List<LocationData> addisLocations = List.of(
            new LocationData(9.0054, 38.7636, "Bole Atlas", "Near Atlas Hotel, Bole"),
            new LocationData(9.0157, 38.7578, "Piazza", "Piazza, Central Addis Ababa"),
            new LocationData(8.9806, 38.7578, "CMC", "CMC Area, Addis Ababa"),
            new LocationData(9.0348, 38.7469, "Mexico Square", "Mexico Square, Addis Ababa"),
            new LocationData(8.99, 38.8, "Sarbet", "Sarbet, Addis Ababa"),
            new LocationData(9.005, 38.763, "Bole Airport", "Addis Ababa Bole International Airport"),
            new LocationData(9.025, 38.749, "Megenagna", "Megenagna Bus Terminal"),
            new LocationData(9.0407, 38.7613, "ECA Conference Center", "ECA Conference Center")
        );
        
        // Demo ride locations in Mekelle
        List<LocationData> mekelleLocations = List.of(
            new LocationData(13.4967, 39.4753, "Central Mekelle", "Central Mekelle Business District"),
            new LocationData(13.502, 39.48, "North Mekelle", "North Mekelle Residential Area"),
            new LocationData(13.49, 39.47, "Mekelle University", "Mekelle University Campus"),
            new LocationData(13.5097563, 39.4690226, "Ayder Hospital", "Ayder Referral Hospital"),
            new LocationData(13.4827799, 39.4902543, "Quiha", "Quiha Subcity, Mekelle")
        );
        
        // Seed completed rides (for analytics)
        seedCompletedRides(customers, drivers, dispatchers, vehicleTypes, addisLocations, mekelleLocations, 8);
        
        // Seed active rides (in progress)
        seedActiveRides(customers, drivers, dispatchers, vehicleTypes, addisLocations, mekelleLocations, 3);
        
        // Seed pending rides (requested)
        seedPendingRides(customers, dispatchers, vehicleTypes, addisLocations, mekelleLocations, 5);
        
        log.info("Successfully seeded 16 demo rides");
    }
    
    private void seedCompletedRides(List customers, List drivers, List dispatchers, List vehicleTypes,
                                  List<LocationData> addisLocations, List<LocationData> mekelleLocations, int count) {
        for (int i = 0; i < count; i++) {
            RideRequest ride = createBaseRide(customers, dispatchers, vehicleTypes, addisLocations, mekelleLocations);
            
            // Assign driver and complete the ride
            ride.setDriverId(getRandomId(drivers));
            ride.setStatus(RideStatus.COMPLETED);
            
            // Set realistic timestamps
            LocalDateTime requestedTime = LocalDateTime.now().minusDays(random.nextInt(30)).minusHours(random.nextInt(24));
            ride.setRequestedAt(requestedTime);
            ride.setAcceptedAt(requestedTime.plusMinutes(2 + random.nextInt(8)));
            ride.setStartedAt(ride.getAcceptedAt().plusMinutes(5 + random.nextInt(15)));
            ride.setCompletedAt(ride.getStartedAt().plusMinutes((int)(ride.getDistanceKm() * 3) + random.nextInt(10)));
            
            rideRequestRepository.save(ride);
        }
    }
    
    private void seedActiveRides(List customers, List drivers, List dispatchers, List vehicleTypes,
                               List<LocationData> addisLocations, List<LocationData> mekelleLocations, int count) {
        for (int i = 0; i < count; i++) {
            RideRequest ride = createBaseRide(customers, dispatchers, vehicleTypes, addisLocations, mekelleLocations);
            
            // Assign driver and start the ride
            ride.setDriverId(getRandomId(drivers));
            ride.setStatus(RideStatus.IN_PROGRESS);
            
            // Set timestamps
            LocalDateTime requestedTime = LocalDateTime.now().minusMinutes(30 + random.nextInt(60));
            ride.setRequestedAt(requestedTime);
            ride.setAcceptedAt(requestedTime.plusMinutes(2 + random.nextInt(5)));
            ride.setStartedAt(ride.getAcceptedAt().plusMinutes(5 + random.nextInt(10)));
            
            rideRequestRepository.save(ride);
        }
    }
    
    private void seedPendingRides(List customers, List dispatchers, List vehicleTypes,
                                List<LocationData> addisLocations, List<LocationData> mekelleLocations, int count) {
        for (int i = 0; i < count; i++) {
            RideRequest ride = createBaseRide(customers, dispatchers, vehicleTypes, addisLocations, mekelleLocations);
            
            // Keep as requested (no driver assigned)
            ride.setStatus(RideStatus.REQUESTED);
            ride.setRequestedAt(LocalDateTime.now().minusMinutes(random.nextInt(30)));
            
            rideRequestRepository.save(ride);
        }
    }
    
    private RideRequest createBaseRide(List customers, List dispatchers, List vehicleTypes,
                                     List<LocationData> addisLocations, List<LocationData> mekelleLocations) {
        RideRequest ride = new RideRequest();
        
        // Randomly choose city locations
        List<LocationData> locations = random.nextBoolean() ? addisLocations : mekelleLocations;
        LocationData pickup = locations.get(random.nextInt(locations.size()));
        LocationData dropoff;
        do {
            dropoff = locations.get(random.nextInt(locations.size()));
        } while (pickup.equals(dropoff));
        
        // Set locations
        ride.setPickupLatitude(pickup.latitude);
        ride.setPickupLongitude(pickup.longitude);
        ride.setPickupAddress(pickup.address);
        ride.setDropoffLatitude(dropoff.latitude);
        ride.setDropoffLongitude(dropoff.longitude);
        ride.setDropoffAddress(dropoff.address);
        
        // Calculate distance
        double distance = calculateDistance(pickup.latitude, pickup.longitude, dropoff.latitude, dropoff.longitude);
        ride.setDistanceKm(distance);
        
        // Assign customer, dispatcher, and vehicle type
        ride.setPassengerId(getRandomId(customers));
        ride.setDispatcherId(getRandomId(dispatchers));
        ride.setVehicleTypeId(getRandomId(vehicleTypes));
        
        // Calculate costs
        BigDecimal estimatedCost = rideCostCalculationService.calculateEstimatedCost(distance, ride.getVehicleTypeId());
        BigDecimal finalCost = rideCostCalculationService.calculateFinalCost(distance, ride.getVehicleTypeId());
        ride.setEstimatedCost(estimatedCost);
        ride.setFinalCost(finalCost);
        
        // Set estimated duration
        ride.setEstimatedDurationMin((int)(distance * 4) + random.nextInt(10)); // ~4 min per km
        
        // Add realistic notes
        String[] notes = {
            "Please call when you arrive",
            "I'll be wearing a blue jacket", 
            "Near the main entrance",
            "Second building on the left",
            "I'll wait by the gate",
            ""
        };
        ride.setNotes(notes[random.nextInt(notes.length)]);
        
        return ride;
    }
    
    private Long getRandomId(List entities) {
        return ((com.niyat.ride.user.models.User) entities.get(random.nextInt(entities.size()))).getId();
    }
    
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula for distance calculation
        double earthRadius = 6371.0;
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
        return earthRadius * c;
    }
    
    private static class LocationData {
        final double latitude;
        final double longitude;
        final String name;
        final String address;
        
        LocationData(double latitude, double longitude, String name, String address) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.name = name;
            this.address = address;
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            LocationData that = (LocationData) obj;
            return Double.compare(that.latitude, latitude) == 0 &&
                   Double.compare(that.longitude, longitude) == 0;
        }
    }
}
