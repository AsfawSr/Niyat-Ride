package com.niyat.ride.config.seeders;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import com.niyat.ride.user.models.Admin;
import com.niyat.ride.user.models.Credential;
import com.niyat.ride.user.repositories.AdminRepository;
import com.niyat.ride.shared.repositories.CredentialRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final AdminRepository adminRepository;
    private final CredentialRepository credentialRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${nyat.admin.email:admin@niyat.com}")
    private String adminEmail; // used as email for Credential

    @Value("${nyat.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${nyat.admin.phone:+251900000000}")
    private String adminPhone;

    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        seedDefaultAdmin();
    }

    // Exposed for unit testing
    void seedDefaultAdmin() {
        if (adminRepository.count() > 0) {
            log.info("Admin seeding skipped: admin already exists (count > 0)");
            return;
        }

        // Create Admin
        Admin admin = new Admin();
        admin.setFirstName("System");
        admin.setLastName("Administrator");
        admin.setPhoneNumber(adminPhone);
        admin.setEmail(adminEmail);
        admin.setIsVerified(true);
        admin.setVerifiedAt(LocalDateTime.now());
        admin.setRole(Role.admin);
        admin.setStatus(AccountStatus.ACTIVE);

        admin = adminRepository.save(admin);

        // Create Credential for password login
        Credential credential = new Credential();
        credential.setEmail(adminEmail);
        credential.setPasswordHash(passwordEncoder.encode(adminPassword));
        credential.setUser(admin);
        credential.setActive(true);
        credentialRepository.save(credential);

        log.info("Seeded default admin with email {}", adminEmail);
    }
}
