package com.niyat.ride.features.admin.user_management.repositories;

import com.niyat.ride.enums.AccountStatus;
import com.niyat.ride.user.models.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface CustomerUserRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
    
    default Page<Customer> findWithFilters(String search, AccountStatus status, 
                                          LocalDateTime createdAtFrom, LocalDateTime createdAtTo, 
                                          Pageable pageable) {
        return findAll(pageable);
    }
}
