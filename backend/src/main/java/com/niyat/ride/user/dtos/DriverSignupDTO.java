package com.niyat.ride.user.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverSignupDTO {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email format")
    private String email; // optional

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{9,15}$", message = "Invalid phone number")
    private String phoneNumber;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @NotBlank(message = "Vehicle model is required")
    private String vehicleModel;

    @NotBlank(message = "Vehicle plate number is required")
    private String vehiclePlateNumber;

    @NotBlank(message = "Front side license image is required")
    private String frontLicenceImage;

    @NotBlank(message = "Back side license image is required")
    private String backLicenceImage;

    @Future(message = "License expiration date must be in the future")
    @NotNull(message = "License expiration date is required")
    private LocalDate licenseExpirations;
}
