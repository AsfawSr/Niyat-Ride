package com.niyat.ride.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long jwtExpiration;

    @Value("${OTP_SECRET_KEY}")
    private String otpSecretKey;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long jwtExpiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.jwtExpiration = jwtExpiration;
    }

    // Generate token with userId + role
    public String generateToken(Long userId, String role) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // subject = userId
                .claim("role", role)                // add role
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract userId (subject)
    public Long extractUserId(String token) {
        return Long.parseLong(extractClaims(token).getSubject());
    }

    // Extract role
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token, Long expectedUserId) {
        Long extractedUserId = extractUserId(token);
        return (extractedUserId.equals(expectedUserId) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }


    /**
     * Generates a temporary JWT token for OTP verification / signup
     * @param phoneNumber the driver phone
     * @return short-lived JWT
     */
    public String generateTempToken(String phoneNumber) {
        Instant now = Instant.now();
        Instant expiry = now.plus(10, ChronoUnit.MINUTES); // token valid for 10 minutes

        return Jwts.builder()
                .setSubject(phoneNumber)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .signWith(SignatureAlgorithm.HS256, otpSecretKey)
                .compact();
    }

    /**
     * Extracts phone number from token
     */
    public String extractPhoneNumber(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(otpSecretKey)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /**
     * Validates if token is expired or malformed
     */
    public boolean validateTempToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(otpSecretKey)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

}
