package com.lalith.customer.controller;

import com.lalith.customer.exception.CustomErrorResponse;
import com.lalith.customer.model.Customer;
import com.lalith.customer.service.CustomerService;
import com.lalith.customer.service.OrderService;
import com.lalith.customer.service.RewardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/customers")
@Validated
public class CustomerController {
    private final CustomerService customerService;
    private final RewardService rewardService;
    private final OrderService orderService;

    public CustomerController(CustomerService customerService, RewardService rewardService, OrderService orderService) {
        this.customerService = customerService;
        this.rewardService = rewardService;
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createCustomer(@Valid @RequestBody Customer customer) {
        ResponseEntity<?> validationResponse = validateCustomerData(customer);
        if (validationResponse != null) {
            return validationResponse;
        }
        try {
            Customer createdCustomer = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
        } catch (ResponseStatusException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    public ResponseEntity<?> validateCustomerData(Customer customer) {
        try {
            if ((customer.getPhoneNo() == null || customer.getPhoneNo().isEmpty()) && (customer.getEmailId() == null || customer.getEmailId().isEmpty())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone Number and Email Id cannot be null or empty.");
            }

            if (customer.getEmailId() == null || customer.getEmailId().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email Id cannot be null or empty.");
            }

            if (customer.getPhoneNo() == null || customer.getPhoneNo().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone Number cannot be null or empty.");
            }

            if (!isValidPhoneNumber(customer.getPhoneNo()) && !isValidEmail(customer.getEmailId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number should be 10 digits and Email Id should be in a valid format");
            }

            if (!isValidPhoneNumber(customer.getPhoneNo())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number should be 10 digits.");
            }

            if (!isValidEmail(customer.getEmailId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email Id should be in a valid format.");
            }
        } catch (ResponseStatusException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
        return null;
    }


    public boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber.matches("\\d{10}");
    }

    public boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllCustomers() {
        try {
            List<Customer> customers = customerService.getAllCustomers();
            return ResponseEntity.ok(customers);
        } catch (ResponseStatusException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    @GetMapping("/{customerId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getCustomerByCustomerId(@PathVariable String customerId) {
        try {
            Optional<Customer> customerOptional = customerService.getCustomerByCustomerId(customerId);

            if (customerOptional.isPresent()) {
                Customer customer = customerOptional.get();
                return ResponseEntity.ok(customer);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer with customerID : " + customerId + " not found.");
            }
        } catch (ResponseStatusException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }


    @GetMapping("/email")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getCustomerByEmailId(@RequestParam String emailId) {
        try {
            Optional<Customer> customer = customerService.getCustomerByEmailId(emailId);
            if (customer.isPresent()) {
                return ResponseEntity.ok(customer.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (ResponseStatusException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    @GetMapping("/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getCustomerByStatus(@RequestParam String status) {
        try {
            List<Customer> customers = customerService.getAllCustomerByStatus(status);
            if (!customers.isEmpty()) {
                return ResponseEntity.ok(customers);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (ResponseStatusException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    @PutMapping("/{customerId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateCustomer(@PathVariable String customerId, @RequestBody Customer updatedCustomer) {
        if (updatedCustomer.getCustomerId() != null && !customerId.equals(updatedCustomer.getCustomerId())) {
            return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
        }

        try {
            Customer updated = customerService.updateCustomer(customerId, updatedCustomer);
            return ResponseEntity.ok(updated);
        } catch (ResponseStatusException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    @DeleteMapping("/{customerId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteCustomer(@PathVariable String customerId) {
        try {
            String response = customerService.deleteCustomer(customerId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (ResponseStatusException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    @GetMapping("/counts")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllCounts() {
        try {
            int customersCount = customerService.getCustomersCount();
            int rewardsCount = rewardService.getRewardsCount();
            int ordersCount = orderService.getOrdersCount();
            List<Integer> count = new ArrayList<>();
            count.add(0, customersCount);
            count.add(1, rewardsCount);
            count.add(2, ordersCount);
            return ResponseEntity.ok(count);
        } catch (ResponseStatusException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }
}