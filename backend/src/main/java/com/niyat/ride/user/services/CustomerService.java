package com.niyat.ride.user.services;

import com.niyat.ride.user.dtos.CustomerResponseDTO;
import com.niyat.ride.user.dtos.CustomerUpdateDTO;

public interface CustomerService {
    void requestOtp(String phoneNumber);
    CustomerResponseDTO verifyOtp(String phoneNumber, String otp);
    CustomerResponseDTO updateCustomer(Long customerId, CustomerUpdateDTO updateDTO);
}
