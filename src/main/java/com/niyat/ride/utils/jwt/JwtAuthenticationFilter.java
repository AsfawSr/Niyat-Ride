package com.niyat.ride.utils.jwt;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.models.Driver;
import com.niyat.ride.models.Passenger;
import com.niyat.ride.models.User;
import com.niyat.ride.repositories.DriverRepository;
import com.niyat.ride.repositories.PassengerRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final PassengerRepository passengerRepository;
    private final DriverRepository driverRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String bearer = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
                String token = bearer.substring(7);
                if (jwtTokenProvider.validateToken(token)) {
                    String username = jwtTokenProvider.getUsernameFromToken(token);
                    Optional<User> userOpt = findByPhone(username);
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        if (user.getStatus() == AccountStatus.ACTIVE && Boolean.TRUE.equals(user.getIsVerified())) {
                            var auth = new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                            );
                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    }
                }
            }
        } catch (Exception ex) {
            log.warn("JWT filter error: {}", ex.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    private Optional<User> findByPhone(String phone) {
        Optional<Passenger> p = passengerRepository.findByPhoneNumber(phone);
        if (p.isPresent()) return Optional.of(p.get());
        Optional<Driver> d = driverRepository.findByPhoneNumber(phone);
        return d.map(dr -> (User) dr);
    }
}
