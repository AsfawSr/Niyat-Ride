package com.niyat.ride.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "passengers")
public class Passenger extends User {
    // Passenger-specific fields can be added here if needed in the future
}
