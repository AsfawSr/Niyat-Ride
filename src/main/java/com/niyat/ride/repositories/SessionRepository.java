package com.niyat.ride.repositories;

import com.niyat.ride.models.Session;
import com.niyat.ride.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByRefreshToken(String refreshToken);
    void deleteByRefreshToken(String refreshToken);
    long deleteByUser(User user);
}
