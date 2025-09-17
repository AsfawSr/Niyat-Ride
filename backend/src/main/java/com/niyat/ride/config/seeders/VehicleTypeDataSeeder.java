package com.niyat.ride.config.seeders;

import com.niyat.ride.vehicle.models.VehicleType;
import com.niyat.ride.features.admin.vehicle_type_management.repositories.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class VehicleTypeDataSeeder {

    private static final Logger log = LoggerFactory.getLogger(VehicleTypeDataSeeder.class);

    private final VehicleTypeRepository vehicleTypeRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        seedVehicleTypes();
    }

    void seedVehicleTypes() {
        if (vehicleTypeRepository.count() > 0) {
            log.info("Vehicle type seeding skipped: vehicle types already exist (count > 0)");
            return;
        }

        log.info("Seeding default vehicle types...");

        // Car
        VehicleType car = new VehicleType();
        car.setName("Car");
        car.setDescription("Standard 4-door sedan for comfortable city rides");
        car.setImage("https://example.com/images/car.jpg");
        car.setPricePerKm(new BigDecimal("15.00"));
        car.setCapacity(4);
        car.setFeatures("Air Conditioning, GPS Navigation, Comfortable Seating");
        car.setIsActive(true);
        car.setCreatedAt(LocalDateTime.now());
        car.setUpdatedAt(LocalDateTime.now());

        // Bajaj (Auto Rickshaw/Tuk-tuk)
        VehicleType bajaj = new VehicleType();
        bajaj.setName("Bajaj");
        bajaj.setDescription("3-wheeler auto rickshaw for quick and affordable rides");
        bajaj.setImage("https://example.com/images/bajaj.jpg");
        bajaj.setPricePerKm(new BigDecimal("8.00"));
        bajaj.setCapacity(3);
        bajaj.setFeatures("Compact, Economical, Quick Navigation");
        bajaj.setIsActive(true);
        bajaj.setCreatedAt(LocalDateTime.now());
        bajaj.setUpdatedAt(LocalDateTime.now());

        // Motor Cycle
        VehicleType motorCycle = new VehicleType();
        motorCycle.setName("Motor Cycle");
        motorCycle.setDescription("2-wheeler motorcycle for fast and efficient rides");
        motorCycle.setImage("https://example.com/images/motorcycle.jpg");
        motorCycle.setPricePerKm(new BigDecimal("5.00"));
        motorCycle.setCapacity(2);
        motorCycle.setFeatures("Fast, Fuel Efficient, Traffic Navigation");
        motorCycle.setIsActive(true);
        motorCycle.setCreatedAt(LocalDateTime.now());
        motorCycle.setUpdatedAt(LocalDateTime.now());

        vehicleTypeRepository.save(car);
        vehicleTypeRepository.save(bajaj);
        vehicleTypeRepository.save(motorCycle);

        log.info("Successfully seeded 3 vehicle types: Car, Bajaj, Motor Cycle");
    }
}
