package com.lalith.customer.service;

import com.lalith.customer.model.Customer;
import com.lalith.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImplementation {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerServiceImplementation(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    public Optional<Customer> getCustomerByStatus(String status) {
        return customerRepository.findByStatus(status);
    }

    public Optional<Customer> getCustomerByEmailId(String emailId) {
        return customerRepository.findByEmailId(emailId);
    }
    public Customer createCustomer(Customer customer) {
        if (customerRepository.findByCustomerId(customer.getCustomerId()).isPresent()) {
            throw new RuntimeException("Customer with the same id already exists");
        }

        if (customerRepository.findByPhoneNo(customer.getPhoneNo()).isPresent()) {
            throw new RuntimeException("Customer with the same phone number already exists");
        }

        if (customerRepository.findByEmailId(customer.getEmailId()).isPresent()) {
            throw new RuntimeException("Customer with the same email address already exists");
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(String id, Customer updatedCustomer) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer with id " + id + " not found");
        }
        Customer existingCustomer = customerRepository.findById(id).orElse(null);
        if (existingCustomer != null) {
            updatedCustomer.setCustomerKey(existingCustomer.getCustomerKey());
            updatedCustomer.setCustomerId(existingCustomer.getCustomerId());
        }
        return customerRepository.save(updatedCustomer);
    }

    public void deleteCustomer(String id) {
        Optional<Customer> optionalCustomer = customerRepository.findById(id);
        if (optionalCustomer.isPresent()) {
            Customer customer = optionalCustomer.get();
            if ("Inactive".equalsIgnoreCase(customer.getStatus())) {
                customerRepository.deleteById(id);
            } else {
                throw new RuntimeException("Customer is not in Inactive status");
            }
        } else {
            throw new RuntimeException("Customer with id " + id + " not found");
        }
    }
}
