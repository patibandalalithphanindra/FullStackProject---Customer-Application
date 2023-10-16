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
        return customerRepository.findByStatus(status);
    }

    @Override
    public int getCustomersCount() {
        List<Customer> customers = customerRepository.findAll();
        return customers.size();
    }

    @Override
    public Optional<Customer> getCustomerByEmailId(String emailId) {
        return customerRepository.findByEmailId(emailId);
    }

    @Override
    public Optional<Customer> getCustomerByPhoneNo(String phoneNo) {
        return customerRepository.findByPhoneNo(phoneNo);
    }

    @Override
    public Customer createCustomer(Customer customer) {
        String customerId = customer.getCustomerId();
        String phoneNo = customer.getPhoneNo();
        String emailId = customer.getEmailId();

        if (customerRepository.findByCustomerId(customer.getCustomerId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Customer with the same id already exists");
        }

        if (customerRepository.findByPhoneNo(customer.getPhoneNo()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Customer with the same phone number already exists");
        }

        if (customerRepository.findByEmailId(customer.getEmailId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Customer with the same email address already exists");
        }

        if (customerId == null) {
            customerId = generateCustomerId();
            customer.setCustomerId(customerId);
        }

        if ((customer.getPhoneNo() == null || customer.getPhoneNo().isEmpty()) && (customer.getEmailId() == null || customer.getEmailId().isEmpty())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email Id and Phone Number cannot be null or empty.");
        }

        if (customer.getEmailId() == null || customer.getEmailId().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email Id cannot be null or empty.");
        }

        if (customer.getPhoneNo() == null || customer.getPhoneNo().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone Number cannot be null or empty.");
        }

        if (!isValidPhoneNumber(customer.getPhoneNo()) && !isValidEmail(customer.getEmailId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number should be 10 digits and Email Id should be of proper format");
        }

        if (!isValidPhoneNumber(customer.getPhoneNo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number should be 10 digits");
        }

        if (!isValidEmail(customer.getEmailId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email Id should be in a valid format");
        }

        return customerRepository.save(customer);
    }

    private boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber == null || phoneNumber.matches("\\d{10}");
    }

    private boolean isValidEmail(String email) {
        return email == null || email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
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

        if (optionalExistingCustomer.get().getCustomerId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "customerId cannot be null.");
        }

        if (optionalExistingCustomer.get().getCustomerKey() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "customerKey cannot be null.");
        }

        Customer existingCustomer = optionalExistingCustomer.get();

        if (updatedCustomer.getCustomerId() != null && !customerId.equals(updatedCustomer.getCustomerId())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Modification of customerId is not allowed.");
        }

        if (!existingCustomer.getCustomerKey().equals(updatedCustomer.getCustomerKey())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Modification of customerKey is not allowed.");
        }

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
        customerRepository.save(existingCustomer);
        return existingCustomer;
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
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer is not in Inactive status, Hence it cannot be deleted!");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer with Id " + customerId + " cannot be found");
        }
    }
}
