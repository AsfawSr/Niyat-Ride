package com.niyat.ride.features.dispatcher.ride_creation.services;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import com.niyat.ride.features.dispatcher.ride_creation.dtos.CustomerInfoDTO;
import com.niyat.ride.user.models.Customer;
import com.niyat.ride.user.repositories.CustomerRepository;
import com.niyat.ride.shared.utils.PhoneNumberUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerOrchestrationServiceImpl implements CustomerOrchestrationService {
    
    private final CustomerRepository customerRepository;
    
    @Override
    @Transactional
    public Customer findOrCreateCustomer(CustomerInfoDTO customerInfo) {
        validateCustomerInfo(customerInfo);
        
        String normalizedPhone = PhoneNumberUtil.normalizeEthiopianPhoneNumber(customerInfo.getPhoneNumber());
        
        // If customer ID is provided, validate it matches the phone number
        if (customerInfo.getCustomerId() != null) {
            Customer existingCustomer = customerRepository.findById(customerInfo.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerInfo.getCustomerId()));
            
            if (!normalizedPhone.equals(existingCustomer.getPhoneNumber())) {
                throw new IllegalArgumentException("Customer ID does not match the provided phone number");
            }
            
            log.info("Found existing customer by ID: {}", customerInfo.getCustomerId());
            return existingCustomer;
        }
        
        // Try to find by phone number first (automatic lookup)
        Customer existingCustomer = findCustomerByPhoneNumber(normalizedPhone);
        if (existingCustomer != null) {
            log.info("Found existing customer by phone: {}", normalizedPhone);
            // Update the customerInfo with the found customer ID for consistency
            customerInfo.setCustomerId(existingCustomer.getId());
            return existingCustomer;
        }
        
        // Create new customer if none found (phone number is unique, so this is a new customer)
        log.info("Creating new customer with phone: {}", normalizedPhone);
        return createMinimalCustomer(customerInfo);
    }
    
    @Override
    public Customer findCustomerByPhoneNumber(String phoneNumber) {
        String normalizedPhone = PhoneNumberUtil.normalizeEthiopianPhoneNumber(phoneNumber);
        return customerRepository.findByPhoneNumber(normalizedPhone).orElse(null);
    }
    
    @Override
    @Transactional
    public Customer createMinimalCustomer(CustomerInfoDTO customerInfo) {
        String normalizedPhone = PhoneNumberUtil.normalizeEthiopianPhoneNumber(customerInfo.getPhoneNumber());
        
        // Check if customer already exists
        if (customerRepository.findByPhoneNumber(normalizedPhone).isPresent()) {
            throw new RuntimeException("Customer already exists with phone number: " + normalizedPhone);
        }
        
        Customer customer = new Customer();
        customer.setFirstName(customerInfo.getFirstName());
        customer.setLastName(customerInfo.getLastName());
        customer.setPhoneNumber(normalizedPhone);
        // Email is no longer part of CustomerInfoDTO, so set to null or generate from phone
        customer.setEmail(null);
        customer.setRole(Role.CUSTOMER);
        customer.setStatus(AccountStatus.ACTIVE); // Auto-activate for dispatcher-created customers
        customer.setIsVerified(false); // Will be verified later if needed
        customer.setCreatedAt(LocalDateTime.now());
        
        Customer savedCustomer = customerRepository.save(customer);
        log.info("Created new customer with ID: {} and phone: {}", savedCustomer.getId(), normalizedPhone);
        
        return savedCustomer;
    }
    
    @Override
    public Customer findCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
    }
    
    @Override
    public void validateCustomerInfo(CustomerInfoDTO customerInfo) {
        if (customerInfo.getFirstName() == null || customerInfo.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer first name is required");
        }
        if (customerInfo.getLastName() == null || customerInfo.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer last name is required");
        }
        if (customerInfo.getPhoneNumber() == null || customerInfo.getPhoneNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer phone number is required");
        }
    }
}
