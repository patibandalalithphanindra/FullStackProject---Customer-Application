package com.lalith.customer.servicetests;

import com.lalith.customer.model.Customer;
import com.lalith.customer.repository.CustomerRepository;
import com.lalith.customer.service.CustomerServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
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
        newCustomer.setEmailId("plp@gmail.com");
        newCustomer.setPhoneNo("1234567890");
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
        String customerKey = "abc123";
        String phoneNo = "1234567890";
        String emailId = "plp@gmail.com";
        Customer existingCustomer = new Customer();
        existingCustomer.setCustomerId(customerId);
        existingCustomer.setPhoneNo(phoneNo);
        existingCustomer.setEmailId(emailId);
        existingCustomer.setCustomerKey(customerKey);
        Customer updatedCustomer = new Customer();
        updatedCustomer.setCustomerId(customerId);
        updatedCustomer.setCustomerKey(customerKey);
        updatedCustomer.setFirstName("UpdatedName");
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.save(updatedCustomer)).thenReturn(updatedCustomer);

        Customer result = customerService.updateCustomer("123", updatedCustomer);
        assertEquals(updatedCustomer.getFirstName(), result.getFirstName());
    }

    @Test
    public void testUpdateCustomerNotFound() {
        String customerId = "nonexistent";
        String customerKey = "abcd";
        Customer updatedCustomer = new Customer();
        updatedCustomer.setCustomerId(customerId);
        updatedCustomer.setCustomerKey(customerKey);
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

    @Test
    public void testGetCustomersCount() {
        List<Customer> customers = new ArrayList<>();
        customers.add(new Customer());
        customers.add(new Customer());

        when(customerRepository.findAll()).thenReturn(customers);

        int result = customerService.getCustomersCount();

        assertEquals(customers.size(), result);
    }

    @Test
    public void testGetCustomerByPhoneNo() {
        String phoneNo = "123-456-7890";
        Customer customer = new Customer();
        customer.setPhoneNo(phoneNo);
        when(customerRepository.findByPhoneNo(phoneNo)).thenReturn(Optional.of(customer));

        Optional<Customer> result = customerService.getCustomerByPhoneNo(phoneNo);

        assertTrue(result.isPresent());
        assertEquals(phoneNo, result.get().getPhoneNo());
    }

    @Test
    public void testGetCustomerByPhoneNoNotFound() {
        String phoneNo = "nonexistent";
        when(customerRepository.findByPhoneNo(phoneNo)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> {
            customerService.getCustomerByPhoneNo(phoneNo);
        });
    }

    @Test
    public void testDeleteCustomerWithActiveStatus() {
        String customerId = "123";
        String status = "Active";
        Customer activeCustomer = new Customer();
        activeCustomer.setCustomerId(customerId);
        activeCustomer.setStatus(status);
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.of(activeCustomer));

        assertThrows(ResponseStatusException.class, () -> {
            customerService.deleteCustomer(customerId);
        });
    }

    @Test
    public void testCreateCustomerWithExistingEmail() {
        Customer existingCustomer = new Customer();
        existingCustomer.setEmailId("existing@example.com");
        when(customerRepository.findByEmailId("existing@example.com")).thenReturn(Optional.of(existingCustomer));

        Customer newCustomer = new Customer();
        newCustomer.setEmailId("existing@example.com");

        assertThrows(ResponseStatusException.class, () -> {
            customerService.createCustomer(newCustomer);
        });
    }


    @Test
    public void testDeleteCustomerWithNullStatus() {
        String customerId = "123";
        Customer nullStatusCustomer = new Customer();
        nullStatusCustomer.setCustomerId(customerId);
        nullStatusCustomer.setStatus(null);
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.of(nullStatusCustomer));

        assertThrows(ResponseStatusException.class, () -> {
            customerService.deleteCustomer(customerId);
        });
    }

    @Test
    public void testDeleteCustomerWithInvalidStatus() {
        String customerId = "123";
        String status = "InvalidStatus";
        Customer invalidStatusCustomer = new Customer();
        invalidStatusCustomer.setCustomerId(customerId);
        invalidStatusCustomer.setStatus(status);
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.of(invalidStatusCustomer));

        assertThrows(ResponseStatusException.class, () -> {
            customerService.deleteCustomer(customerId);
        });
    }

    @Test
    public void testGetCustomerByCustomerIdNotFound() {
        String customerId = "nonexistent";
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> {
            customerService.getCustomerByCustomerId(customerId);
        });
    }

    @Test
    public void testGetCustomersCountWithEmptyList() {
        List<Customer> customers = new ArrayList<>();
        when(customerRepository.findAll()).thenReturn(customers);

        int result = customerService.getCustomersCount();

        assertEquals(0, result);
    }

    @Test
    public void testGetCustomerByCustomerIdFound() {
        String customerId = "123";
        Customer customer = new Customer();
        customer.setCustomerId(customerId);
        when(customerRepository.findByCustomerId(customerId)).thenReturn(Optional.of(customer));

        Optional<Customer> result = customerService.getCustomerByCustomerId(customerId);

        assertTrue(result.isPresent());
        assertEquals(customerId, result.get().getCustomerId());
    }

    @Test
    public void testGetCustomerByCustomerIdWithNullId() {
        String customerId = null;

        assertThrows(ResponseStatusException.class, () -> {
            customerService.getCustomerByCustomerId(customerId);
        });
    }

    @Test
    public void testGetAllCustomersEmptyList() {
        List<Customer> customers = new ArrayList<>();
        when(customerRepository.findAll()).thenReturn(customers);

        List<Customer> result = customerService.getAllCustomers();

        verify(customerRepository, times(1)).findAll();

        assertTrue(result.isEmpty());
    }

    @Test
    public void testGetAllCustomerByStatusEmptyList() {
        String status = "Active";
        List<Customer> customers = new ArrayList<>();
        when(customerRepository.findByStatus(status)).thenReturn(customers);

        try {
            customerService.getAllCustomerByStatus(status);
            fail("Expected ResponseStatusException to be thrown");
        } catch (ResponseStatusException ex) {
            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            assertEquals("No customers found with status: " + status, ex.getReason());
        }
    }



    @Test
    public void testDeleteCustomerWithNullId() {
        String customerId = null;

        assertThrows(ResponseStatusException.class, () -> {
            customerService.deleteCustomer(customerId);
        });
    }
}
