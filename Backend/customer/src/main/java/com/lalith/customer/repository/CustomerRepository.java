package com.lalith.customer.repository;

import com.lalith.customer.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, String> {
    Optional<Customer> findByCustomerId(String customerId);
    Optional<Customer> findByPhoneNo(String phoneNo);
    Optional<Customer> findByEmailId(String emailId);

    Optional<Customer> findByStatus(String status);
}
