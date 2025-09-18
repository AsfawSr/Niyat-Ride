package com.niyat.ride.config;

import com.niyat.ride.dispatcher.models.Dispatcher;
import com.niyat.ride.dispatcher.repositories.DispatcherRepository;
import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DispatcherDataSeeder {
    
    private final DispatcherRepository dispatcherRepository;
    
    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        seedDispatchers();
    }
    
    void seedDispatchers() {
        if (dispatcherRepository.count() > 0) {
            log.info("Dispatcher seeding skipped: dispatchers already exist (count > 0)");
            return;
        }
        
        log.info("Seeding dispatchers for demo...");
        
        // Dispatcher 1 - Addis Ababa Region
        Dispatcher dispatcher1 = new Dispatcher();
        dispatcher1.setFirstName("Hanna");
        dispatcher1.setLastName("Bekele");
        dispatcher1.setPhoneNumber("+251911000001");
        dispatcher1.setEmail("hanna.bekele@niyat.com");
        dispatcher1.setAssignedRegion("Addis Ababa");
        dispatcher1.setRole(Role.dispatcher);
        dispatcher1.setStatus(AccountStatus.ACTIVE);
        dispatcher1.setIsVerified(true);
        dispatcher1.setVerifiedAt(LocalDateTime.now());
        dispatcher1.setCreatedAt(LocalDateTime.now());
        dispatcherRepository.save(dispatcher1);
        
        // Dispatcher 2 - Mekelle Region
        Dispatcher dispatcher2 = new Dispatcher();
        dispatcher2.setFirstName("Tekle");
        dispatcher2.setLastName("Hagos");
        dispatcher2.setPhoneNumber("+251914000002");
        dispatcher2.setEmail("tekle.hagos@niyat.com");
        dispatcher2.setAssignedRegion("Mekelle");
        dispatcher2.setRole(Role.dispatcher);
        dispatcher2.setStatus(AccountStatus.ACTIVE);
        dispatcher2.setIsVerified(true);
        dispatcher2.setVerifiedAt(LocalDateTime.now());
        dispatcher2.setCreatedAt(LocalDateTime.now());
        dispatcherRepository.save(dispatcher2);
        
        // Dispatcher 3 - Central Operations
        Dispatcher dispatcher3 = new Dispatcher();
        dispatcher3.setFirstName("Sara");
        dispatcher3.setLastName("Mohammed");
        dispatcher3.setPhoneNumber("+251917000003");
        dispatcher3.setEmail("sara.mohammed@niyat.com");
        dispatcher3.setAssignedRegion("Central Operations");
        dispatcher3.setRole(Role.dispatcher);
        dispatcher3.setStatus(AccountStatus.ACTIVE);
        dispatcher3.setIsVerified(true);
        dispatcher3.setVerifiedAt(LocalDateTime.now());
        dispatcher3.setCreatedAt(LocalDateTime.now());
        dispatcherRepository.save(dispatcher3);
        
        log.info("Successfully seeded 3 dispatchers for demo");
    }
}
