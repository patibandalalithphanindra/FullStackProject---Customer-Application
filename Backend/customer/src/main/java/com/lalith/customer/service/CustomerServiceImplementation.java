package com.lalith.customer.service;

import com.lalith.customer.model.Customer;
import com.lalith.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    public List<Customer> getAllCustomerByStatus(String status) {
        List<Customer> customers = customerRepository.findByStatus(status);
        if (!customers.isEmpty()) {
            return customers;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No customers found with status: " + status);
        }
    }

    @Override
    public int getCustomersCount() {
        List<Customer> customers = customerRepository.findAll();
        return customers.size();
    }

    @Override
    public Optional<Customer> getCustomerByEmailId(String emailId) {
        Optional<Customer> customer = customerRepository.findByEmailId(emailId);
        if (customer.isPresent()) {
            return customer;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found by email: " + emailId);
        }
    }

    @Override
    public Optional<Customer> getCustomerByPhoneNo(String phoneNo) {
        Optional<Customer> customer = customerRepository.findByPhoneNo(phoneNo);
        if (customer.isPresent()) {
            return customer;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found by phone number: " + phoneNo);
        }
    }

    @Override
    public Customer createCustomer(Customer customer) {
        String customerId = customer.getCustomerId();

        if (customerId == null) {
            customerId = generateCustomerId();
            customer.setCustomerId(customerId);
        }

        if (customerRepository.findByCustomerId(customer.getCustomerId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer with the same id already exists");
        }

        if (customerRepository.findByPhoneNo(customer.getPhoneNo()).isPresent() && customerRepository.findByEmailId(customer.getEmailId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer with the same phone number and email Id already exists");
        }

        if (customerRepository.findByPhoneNo(customer.getPhoneNo()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer with the same phone number already exists");
        }

        if (customerRepository.findByEmailId(customer.getEmailId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer with the same email address already exists");
        }

        return customerRepository.save(customer);
    }

    private String generateCustomerId() {
        UUID uuid = UUID.randomUUID();
        return "c" + uuid.toString().replace("-", "").substring(0, 9);
    }

    @Override
    public Optional<Customer> getCustomerByCustomerId(String customerId) {
        Optional<Customer> customer = customerRepository.findByCustomerId(customerId);
        if (customer.isPresent()) {
            return customer;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer with customerID : " + customerId + " not found.");
        }
    }

    @Override
    public Customer updateCustomer(String customerId, Customer updatedCustomer) {
        Optional<Customer> optionalExistingCustomer = customerRepository.findByCustomerId(customerId);

        if (optionalExistingCustomer.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with customerId: " + customerId);
        }

        Customer existingCustomer = optionalExistingCustomer.get();

        updateCustomerFields(existingCustomer, updatedCustomer);

        customerRepository.save(existingCustomer);
        return existingCustomer;
    }

    private void updateCustomerFields(Customer existingCustomer, Customer updatedCustomer) {
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
    }


    @Override
    public String deleteCustomer(String customerId) {
        Optional<Customer> optionalCustomer = customerRepository.findByCustomerId(customerId);

        if (optionalCustomer.isPresent()) {
            Customer customer = optionalCustomer.get();
            if ("Inactive".equalsIgnoreCase(customer.getStatus())) {
                customerRepository.deleteById(customer.getCustomerKey());
                return "Customer with id " + customerId + " has been deleted successfully!";
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer is not in Inactive status, Hence cannot be deleted!");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer with Id " + customerId + " cannot be found");
        }
    }
}
