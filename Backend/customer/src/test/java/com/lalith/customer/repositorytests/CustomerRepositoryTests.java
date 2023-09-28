package com.lalith.customer.repositorytests;

import com.lalith.customer.model.Customer;
import com.lalith.customer.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CustomerRepositoryTests {

    @Autowired
    private CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        Customer customer1 = new Customer();
        customer1.setCustomerId("1");
        customer1.setFirstName("John");
        customer1.setLastName("Doe");
        customer1.setPhoneNo("1234567890");
        customer1.setEmailId("john@example.com");
        customer1.setStatus("ACTIVE");

        Customer customer2 = new Customer();
        customer2.setCustomerId("2");
        customer2.setFirstName("Jane");
        customer2.setLastName("Smith");
        customer2.setPhoneNo("9876543210");
        customer2.setEmailId("jane@example.com");
        customer2.setStatus("INACTIVE");

        customerRepository.save(customer1);
        customerRepository.save(customer2);
    }

    @Test
    void testFindByPhoneNo() {
        String phoneNumberToSearch = "7893547584";
        Optional<Customer> actualCustomer = customerRepository.findByPhoneNo(phoneNumberToSearch);
        assertNotNull(actualCustomer);
        assertEquals(phoneNumberToSearch, actualCustomer.get().getPhoneNo());
    }

    @Test
    void testFindByStatus() {
        String statusToSearch = "Active";
        List<Customer> customers = customerRepository.findByStatus(statusToSearch);
        assertNotNull(customers);
    }

    @Test
    void testFindByCustomerId() {
        String customerIdToSearch = "C3d73bd372";
        Optional<Customer> actualCustomer = customerRepository.findByCustomerId(customerIdToSearch);
        assertTrue(actualCustomer.isPresent());

        assertEquals(customerIdToSearch, actualCustomer.get().getCustomerId());
    }

    @Test
    void testFindByEmailId() {
        String emailToSearch = "patibandalp01@gmail.com";
        Optional<Customer> actualCustomer = customerRepository.findByEmailId(emailToSearch);
        assertNotNull(actualCustomer);
        assertEquals(emailToSearch, actualCustomer.get().getEmailId());
    }
}
