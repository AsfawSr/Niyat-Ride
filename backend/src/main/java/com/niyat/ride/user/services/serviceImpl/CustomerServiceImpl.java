package com.niyat.ride.user.services.serviceImpl;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.enums.Role;
import com.niyat.ride.otp.services.OtpService;
import com.niyat.ride.shared.exceptions.CustomerDoesNotExistException;
import com.niyat.ride.user.dtos.CustomerResponseDTO;
import com.niyat.ride.user.dtos.CustomerUpdateDTO;
import com.niyat.ride.user.mappers.CustomerMapper;
import com.niyat.ride.user.models.Customer;
import com.niyat.ride.user.repositories.CustomerRepository;
import com.niyat.ride.user.services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final OtpService otpService;

    @Override
    public void requestOtp(String phoneNumber) {
        otpService.sendOtp(phoneNumber);
    }

    @Override
    @Transactional
    public CustomerResponseDTO verifyOtp(String phoneNumber, String otp) {
        if (!otpService.verifyOtp(phoneNumber, otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        Customer customer = customerRepository.findByPhoneNumber(phoneNumber)
                .orElseGet(() -> createNewCustomer(phoneNumber));

        otpService.clearOtp(phoneNumber);
        return customerMapper.toResponseDTO(customer);
    }

    @Override
    @Transactional
    public CustomerResponseDTO updateCustomer(Long customerId, CustomerUpdateDTO updateDTO) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerDoesNotExistException("Customer not found with id: " + customerId));

        customer.setFirstName(updateDTO.getFirstName());
        customer.setLastName(updateDTO.getLastName());
        customer.setEmail(updateDTO.getEmail());
        customer.setUpdatedAt(LocalDateTime.now());

        Customer updatedCustomer = customerRepository.save(customer);
        return customerMapper.toResponseDTO(updatedCustomer);
    }

    private Customer createNewCustomer(String phoneNumber) {
        Customer customer = new Customer();
        customer.setPhoneNumber(phoneNumber);
        customer.setRole(Role.CUSTOMER);
        customer.setStatus(AccountStatus.ACTIVE);
        customer.setIsVerified(true);
        customer.setVerifiedAt(LocalDateTime.now());
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }
}
