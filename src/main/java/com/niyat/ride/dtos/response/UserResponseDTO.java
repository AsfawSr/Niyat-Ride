package com.niyat.ride.dtos.response;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    
    @Schema(example = "1")
    private Long id;

    @Schema(example = "John Doe")
    private String name;

    @Schema(example = "+251911223344")
    private String phoneNumber;

    @Schema(example = "")
    private String email;

    @Schema(example = "")
    private String profilePicture;

    @Schema(implementation = Role.class)
    private Role role;

    @Schema(implementation = AccountStatus.class)
    private AccountStatus status;

    @Schema(example = "false")
    private Boolean isVerified;

    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
