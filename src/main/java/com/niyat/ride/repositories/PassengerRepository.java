package com.niyat.ride.repositories;

import com.niyat.ride.models.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    Optional<Passenger> findByPhoneNumber(String phoneNumber);
    Optional<Passenger> findByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
}
