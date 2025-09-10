package com.niyat.ride.ride.dtos;

import lombok.Data;

@Data
public class TripActionDTO {
    private String action; // START or CANCEL
    private String reason;
}
