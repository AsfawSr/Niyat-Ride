package com.niyat.ride.features.dispatcher.ride_creation.services;

import com.niyat.ride.features.dispatcher.ride_creation.dtos.CustomerInfoDTO;
import com.niyat.ride.user.models.Customer;

public interface CustomerOrchestrationService {
    
    /**
     * Find or create customer based on phone number and customer info
     * 
     * @param customerInfo Customer information from dispatcher
     * @return Customer entity (existing or newly created)
     */
    Customer findOrCreateCustomer(CustomerInfoDTO customerInfo);
    
    /**
     * Find existing customer by phone number
     * 
     * @param phoneNumber Normalized phone number
     * @return Customer if found, null otherwise
     */
    Customer findCustomerByPhoneNumber(String phoneNumber);
    
    /**
     * Create a new customer with minimal information
     * 
     * @param customerInfo Customer details
     * @return Newly created customer
     */
    Customer createMinimalCustomer(CustomerInfoDTO customerInfo);
    
    /**
     * Find existing customer by ID
     * 
     * @param customerId Customer ID
     * @return Customer if found
     * @throws RuntimeException if customer not found
     */
    Customer findCustomerById(Long customerId);
    
    /**
     * Validate customer information completeness
     * 
     * @param customerInfo Customer information to validate
     * @throws IllegalArgumentException if validation fails
     */
    void validateCustomerInfo(CustomerInfoDTO customerInfo);
}
