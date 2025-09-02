package com.niyat.ride.user.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverSignupDTO {
    @NotBlank(message = "Full name is required")
    private String firstName;

    @NotBlank(message = "Full name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{9,15}$", message = "Invalid phone number")
    private String phoneNumber;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleModel;

    @NotBlank(message = "Vehicle plate number is required")
    private String vehiclePlateNumber;

    @NotBlank(message = "front side licence image is required")
    private String frontLicenceImage;

    @NotBlank(message = "front side license image is required")
    private String backLicenceImage;

//    @NotBlank(message = "Vehicle plate number is required")
//    private LocalDate licesneExipirationDate;


}