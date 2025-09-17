package com.niyat.ride.config.seeders;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import com.niyat.ride.user.models.Driver;
import com.niyat.ride.user.repositories.DriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@Order(4)
@RequiredArgsConstructor
public class DriverDataSeeder implements CommandLineRunner {

    private final DriverRepository driverRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public void run(String... args) throws Exception {
        if (driverRepository.count() > 0) {
            log.info("Driver seeding skipped: drivers already exist (count > 0)");
            return;
        }

        log.info("Seeding drivers with locations in Addis Ababa and Mekelle...");
        seedDrivers();
        log.info("Driver seeding completed successfully");
    }

    private void seedDrivers() {
        List<Driver> drivers = new ArrayList<>();

        // Addis Ababa drivers (coordinates around the city)
        drivers.add(createDriver("Chaltu", "Girma", "+251911234570", "AA004", 9.0348, 38.7469, true)); // Addis Ketema
        drivers.add(createDriver("Desta", "Mulugeta", "+251911234571", "AA005", 8.9900, 38.8000, true)); // East Addis
        drivers.add(createDriver("Emebet", "Wolde", "+251911234572", "AA006", 9.0200, 38.7300, false)); // Offline driver in Addis

        // Mekelle drivers (coordinates around Mekelle city)
        drivers.add(createDriver("Asfaw", "Yemane", "+251988492462", "MK001", 13.4967, 39.4753, true)); // Central Mekelle
        drivers.add(createDriver("Mahtot", "Gher", "+251962596962", "MK002", 13.5020, 39.4800, true)); // North Mekelle
        drivers.add(createDriver("Robel", "Guesh", "+251911000169", "MK003", 13.4900, 39.4700, true)); // South Mekelle
        drivers.add(createDriver("Daniel", "Hagos", "+251908208659", "MK004", 13.5100, 39.4850, true)); // East Mekelle

        // Save all drivers
        driverRepository.saveAll(drivers);
        log.info("Seeded {} drivers: {} in Addis Ababa, {} in Mekelle", 
                drivers.size(), 
                drivers.stream().filter(d -> d.getLicenseNumber().startsWith("AA")).count(),
                drivers.stream().filter(d -> d.getLicenseNumber().startsWith("MK")).count());
    }

    private Driver createDriver(String firstName, String lastName, String phoneNumber, 
                               String licenseNumber, double latitude, double longitude, boolean isOnline) {
        Driver driver = new Driver();
        
        // User fields
        driver.setFirstName(firstName);
        driver.setLastName(lastName);
        driver.setPhoneNumber(phoneNumber);
        driver.setEmail(phoneNumber.replace("+251", "") + "@niyatride.com");
        driver.setRole(Role.DRIVER);
        driver.setStatus(AccountStatus.ACTIVE);
        driver.setIsVerified(true);
        driver.setCreatedAt(LocalDateTime.now());
        
        // Driver specific fields
        driver.setLicenseNumber(licenseNumber);
        driver.setCurrentLatitude(latitude);
        driver.setCurrentLongitude(longitude);
        driver.setIsOnline(isOnline);
        driver.setLastLocationUpdate(LocalDateTime.now());
        
        // Create PostGIS Point geometry
        Point location = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        location.setSRID(4326);
        driver.setCurrentLocation(location);
        
        return driver;
    }
}
