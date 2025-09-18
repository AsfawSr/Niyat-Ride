package com.niyat.ride.config;

import com.niyat.ride.user.models.Customer;
import com.niyat.ride.user.repositories.CustomerRepository;
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
public class CustomerDataSeeder {
    
    private final CustomerRepository customerRepository;
    
    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        seedCustomers();
    }
    
    void seedCustomers() {
        if (customerRepository.count() > 5) {
            log.info("Customer seeding skipped: customers already exist (count > 5)");
            return;
        }
        
        log.info("Seeding customers for demo...");
        
        // Customer 1 - Addis Ababa
        Customer customer1 = new Customer();
        customer1.setFirstName("Abebe");
        customer1.setLastName("Tadesse");
        customer1.setPhoneNumber("+251912345001");
        customer1.setEmail("abebe.tadesse@gmail.com");
        customer1.setRole(Role.CUSTOMER);
        customer1.setStatus(AccountStatus.ACTIVE);
        customer1.setIsVerified(true);
        customer1.setVerifiedAt(LocalDateTime.now());
        customer1.setCreatedAt(LocalDateTime.now());
        customerRepository.save(customer1);
        
        // Customer 2 - Business User
        Customer customer2 = new Customer();
        customer2.setFirstName("Meron");
        customer2.setLastName("Alemayehu");
        customer2.setPhoneNumber("+251923456002");
        customer2.setEmail("meron.alemayehu@business.com");
        customer2.setRole(Role.CUSTOMER);
        customer2.setStatus(AccountStatus.ACTIVE);
        customer2.setIsVerified(true);
        customer2.setVerifiedAt(LocalDateTime.now());
        customer2.setCreatedAt(LocalDateTime.now());
        customerRepository.save(customer2);
        
        // Customer 3 - Frequent Traveler
        Customer customer3 = new Customer();
        customer3.setFirstName("Daniel");
        customer3.setLastName("Wondimu");
        customer3.setPhoneNumber("+251934567003");
        customer3.setEmail("daniel.wondimu@hotmail.com");
        customer3.setRole(Role.CUSTOMER);
        customer3.setStatus(AccountStatus.ACTIVE);
        customer3.setIsVerified(true);
        customer3.setVerifiedAt(LocalDateTime.now());
        customer3.setCreatedAt(LocalDateTime.now());
        customerRepository.save(customer3);
        
        // Customer 4 - Mekelle Customer
        Customer customer4 = new Customer();
        customer4.setFirstName("Tigist");
        customer4.setLastName("Gebru");
        customer4.setPhoneNumber("+251945678004");
        customer4.setEmail("tigist.gebru@yahoo.com");
        customer4.setRole(Role.CUSTOMER);
        customer4.setStatus(AccountStatus.ACTIVE);
        customer4.setIsVerified(true);
        customer4.setVerifiedAt(LocalDateTime.now());
        customer4.setCreatedAt(LocalDateTime.now());
        customerRepository.save(customer4);
        
        // Customer 5 - Tourist/Visitor
        Customer customer5 = new Customer();
        customer5.setFirstName("James");
        customer5.setLastName("Smith");
        customer5.setPhoneNumber("+251956789005");
        customer5.setEmail("james.smith@visitor.com");
        customer5.setRole(Role.CUSTOMER);
        customer5.setStatus(AccountStatus.ACTIVE);
        customer5.setIsVerified(true);
        customer5.setVerifiedAt(LocalDateTime.now());
        customer5.setCreatedAt(LocalDateTime.now());
        customerRepository.save(customer5);
        
        log.info("Successfully seeded 5 customers for demo");
    }
}
