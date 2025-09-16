package com.niyat.ride.otp.repositories;

import com.niyat.ride.otp.models.OtpEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpEntry, String> {
    Optional<OtpEntry> findByPhoneNumber(String phoneNumber);
}
