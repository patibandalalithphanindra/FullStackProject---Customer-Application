package com.lalith.customer.servicetests;

import com.lalith.customer.controller.CustomerController;
import com.lalith.customer.model.Customer;
import com.lalith.customer.repository.CustomerRepository;
import com.lalith.customer.service.CustomerServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CustomerServiceTests {

    @Mock
    private CustomerRepository customerRepository;
    @InjectMocks
    private CustomerServiceImplementation customerService;
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllCustomers() {
        List<Customer> customers = new ArrayList<>();
        customers.add(new Customer());
        customers.add(new Customer());

        when(customerRepository.findAll()).thenReturn(customers);

        List<Customer> result = customerService.getAllCustomers();

        verify(customerRepository, times(1)).findAll();

        assertEquals(customers.size(), result.size());
    }

    @Test
    public void testGetAllCustomerByStatus() {
        String status = "Active";
        List<Customer> customers = new ArrayList<>();
        customers.add(new Customer());
        customers.add(new Customer());
        when(customerRepository.findByStatus(status)).thenReturn(customers);

        List<Customer> result = customerService.getAllCustomerByStatus(status);

        assertEquals(customers.size(), result.size());
    }

    @Test
    public void testGetCustomerByEmailId() {
        String emailId = "test@example.com";
        Customer customer = new Customer();
        customer.setEmailId(emailId);
        when(customerRepository.findByEmailId(emailId)).thenReturn(Optional.of(customer));

        Optional<Customer> result = customerService.getCustomerByEmailId(emailId);

        assertTrue(result.isPresent());
        assertEquals(emailId, result.get().getEmailId());
    }

    @Test
    public void testCreateCustomer() {
        Customer newCustomer = new Customer();
        newCustomer.setCustomerId("456");
        when(customerRepository.findByCustomerId("456")).thenReturn(Optional.empty());
        when(customerRepository.findByPhoneNo(newCustomer.getPhoneNo())).thenReturn(Optional.empty());
        when(customerRepository.findByEmailId(newCustomer.getEmailId())).thenReturn(Optional.empty());
        when(customerRepository.save(newCustomer)).thenReturn(newCustomer);

        Customer result = customerService.createCustomer(newCustomer);

        assertEquals(newCustomer.getCustomerId(), result.getCustomerId());
    }

    @Test
    public void testCreateCustomerWithExistingCustomerId() {
        Customer existingCustomer = new Customer();
        existingCustomer.setCustomerId("789");
        when(customerRepository.findByCustomerId("789")).thenReturn(Optional.of(existingCustomer));

        assertThrows(ResponseStatusException.class, () -> {
            customerService.createCustomer(existingCustomer);
        });
    }

    @Test
    public void testGetCustomerByCustomerId() {
        String customerId = "456";
        Customer customer = new Customer();
        customer.setCustomerId(customerId);
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.of(customer));

        Optional<Customer> result = customerService.getCustomerByCustomerId(customerId);

        assertTrue(result.isPresent());
        assertEquals(customerId, result.get().getCustomerId());
    }

    @Test
    public void testUpdateCustomer() {
        String customerId = "123";
        Customer existingCustomer = new Customer();
        existingCustomer.setCustomerId(customerId);
        Customer updatedCustomer = new Customer();
        updatedCustomer.setCustomerId(customerId);
        updatedCustomer.setFirstName("UpdatedName");
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.save(updatedCustomer)).thenReturn(updatedCustomer);

        Customer result = customerService.updateCustomer(customerId, updatedCustomer);

        assertEquals(updatedCustomer.getFirstName(), result.getFirstName());
    }

    @Test
    public void testUpdateCustomerNotFound() {
        String customerId = "nonexistent";
        Customer updatedCustomer = new Customer();
        updatedCustomer.setCustomerId(customerId);
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> {
            customerService.updateCustomer(customerId, updatedCustomer);
        });
    }

    @Test
    public void testDeleteCustomer() {
        String customerId = "123";
        String status = "Inactive";
        Customer existingCustomer = new Customer();
        existingCustomer.setCustomerId(customerId);
        existingCustomer.setStatus(status);
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.of(existingCustomer));
        doNothing().when(customerRepository).deleteById(existingCustomer.getCustomerKey());

        String result = customerService.deleteCustomer(customerId);

        assertEquals("Customer with id " + customerId + " has been deleted successfully!", result);
    }

    @Test
    public void testDeleteCustomerNotFound() {
        String customerId = "nonexistent";
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> {
            customerService.deleteCustomer(customerId);
        });
    }

    @Test
    public void testDeleteCustomerNotInactive() {
        String customerId = "123";
        Customer activeCustomer = new Customer();
        activeCustomer.setCustomerId(customerId);
        activeCustomer.setStatus("Active");
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.of(activeCustomer));

        assertThrows(ResponseStatusException.class, () -> {
            customerService.deleteCustomer(customerId);
        });
    }
}
