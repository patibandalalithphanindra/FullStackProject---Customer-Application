package com.lalith.customer.service;

import com.lalith.customer.model.Customer;
import java.util.List;
import java.util.Optional;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Optional<Customer> getCustomerByStatus(String status);
    Optional<Customer> getCustomerByEmailId(String emailId);
    Customer createCustomer(Customer customer);
    Customer updateCustomer(String customerId, Customer updatedCustomer);
    void deleteCustomer(String customerId);
}
