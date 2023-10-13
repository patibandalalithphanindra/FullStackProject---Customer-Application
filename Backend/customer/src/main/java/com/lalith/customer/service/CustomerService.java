package com.lalith.customer.service;

import com.lalith.customer.model.Customer;
import java.util.List;
import java.util.Optional;

public interface CustomerService {
    List<Customer> getAllCustomers();
    List<Customer> getAllCustomerByStatus(String status);
    Optional<Customer> getCustomerByEmailId(String emailId);
    Optional<Customer> getCustomerByPhoneNo(String phoneNo);
    Customer createCustomer(Customer customer);
    Customer updateCustomer(String customerId, Customer updatedCustomer);
    String deleteCustomer(String customerId);
    int getCustomersCount();
    Optional<Customer> getCustomerByCustomerId(String customerId);

}
