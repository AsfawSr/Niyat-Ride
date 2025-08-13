package com.niyat.ride.dtos.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverRegistrationDTO {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{8,14}$", message = "Invalid phone number format")
    private String phoneNumber;
    
    @NotBlank(message = "License number is required")
    @Size(min = 5, max = 50, message = "License number must be between 5 and 50 characters")
    private String licenseNumber;
    
    @NotBlank(message = "Plate number is required")
    @Size(min = 3, max = 20, message = "Plate number must be between 3 and 20 characters")
    private String plateNumber;
    
    @NotBlank(message = "Vehicle type is required")
    @Size(min = 2, max = 50, message = "Vehicle type must be between 2 and 50 characters")
    private String vehicleType;
    
    @NotBlank(message = "Vehicle color is required")
    @Size(min = 2, max = 30, message = "Vehicle color must be between 2 and 30 characters")
    private String vehicleColor;

    // Files (required for MVP)
    @Schema(type = "string", format = "binary", description = "Driver's license image (JPG/PNG)")
    private MultipartFile licenseImage;

    @Schema(type = "string", format = "binary", description = "Vehicle registration document (PDF/JPG/PNG)")
    private MultipartFile vehicleRegistrationDocument;
}
