package com.niyat.ride.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "drivers")
public class Driver extends User {
    
    @Column(unique = true, nullable = false)
    private String licenseNumber;
    
    @Column(unique = true, nullable = false)
    private String plateNumber;
    
    @Column(nullable = false)
    private String vehicleType;
    
    @Column(nullable = false)
    private String vehicleColor;

    @Column(name = "license_image_path")
    private String licenseImagePath;

    @Column(name = "vehicle_registration_doc_path")
    private String vehicleRegistrationDocPath;
}
