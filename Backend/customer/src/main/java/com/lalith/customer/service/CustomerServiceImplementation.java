package com.lalith.customer.service;

import com.lalith.customer.model.Customer;
import com.lalith.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImplementation implements CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerServiceImplementation(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> getCustomerByStatus(String status) {
        return customerRepository.findByStatus(status);
    }

    @Override
    public Optional<Customer> getCustomerByEmailId(String emailId) {
        return customerRepository.findByEmailId(emailId);
    }

    @Override
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

    @Override
    public Customer updateCustomer(String customerId, Customer updatedCustomer) {
        Optional<Customer> optionalExistingCustomer = customerRepository.findByCustomerId(customerId);

        if (optionalExistingCustomer.isPresent()) {
            Customer existingCustomer = optionalExistingCustomer.get();

            if (updatedCustomer.getFirstName() != null) {
                existingCustomer.setFirstName(updatedCustomer.getFirstName());
            }
            if (updatedCustomer.getLastName() != null) {
                existingCustomer.setLastName(updatedCustomer.getLastName());
            }
            if (updatedCustomer.getAddressLine1() != null) {
                existingCustomer.setAddressLine1(updatedCustomer.getAddressLine1());
            }
            if (updatedCustomer.getAddressLine2() != null) {
                existingCustomer.setAddressLine2(updatedCustomer.getAddressLine2());
            }
            if (updatedCustomer.getCity() != null) {
                existingCustomer.setCity(updatedCustomer.getCity());
            }
            if (updatedCustomer.getState() != null) {
                existingCustomer.setState(updatedCustomer.getState());
            }
            if (updatedCustomer.getZipCode() != null) {
                existingCustomer.setZipCode(updatedCustomer.getZipCode());
            }
            if (updatedCustomer.getCountry() != null) {
                existingCustomer.setCountry(updatedCustomer.getCountry());
            }
            if (updatedCustomer.getPhoneNo() != null) {
                existingCustomer.setPhoneNo(updatedCustomer.getPhoneNo());
            }
            if (updatedCustomer.getEmailId() != null) {
                existingCustomer.setEmailId(updatedCustomer.getEmailId());
            }
            if (updatedCustomer.getStatus() != null) {
                existingCustomer.setStatus(updatedCustomer.getStatus());
            }

            return customerRepository.save(existingCustomer);
        } else {
            throw new RuntimeException("Customer with id " + customerId + " not found");
        }
    }

    @Override
    public void deleteCustomer(String customerId) {
        Optional<Customer> optionalCustomer = customerRepository.findByCustomerId(customerId);
        if (optionalCustomer.isPresent()) {
            Customer customer = optionalCustomer.get();
            if ("Inactive".equalsIgnoreCase(customer.getStatus())) {
                customerRepository.deleteById(customerId);
            } else {
                throw new RuntimeException("Customer is not in Inactive status");
            }
        } else {
            throw new RuntimeException("Customer with id " + customerId + " not found");
        }
    }
}
