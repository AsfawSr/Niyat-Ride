package com.niyat.ride.user.dtos;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Role role;
    private AccountStatus status;
    private String licenseNumber;
    private String vehicleModel;
    private String vehiclePlateNumber;
    private String frontLicenceImage;
    private String backLicenceImage;
    private Boolean isOnline;

    //  fields for location
    private Double latitude;
    private Double longitude;
}
