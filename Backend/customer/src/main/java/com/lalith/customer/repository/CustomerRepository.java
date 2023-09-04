package com.lalith.customer.repository;

import com.lalith.customer.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CustomerRepository extends MongoRepository<Customer,String> {

}
