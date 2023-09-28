package com.lalith.customer.ModelTests;

import com.lalith.customer.model.Customer;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CustomerTest {

    @Test
    public void testCustomerModel() {
        Customer customer = new Customer();
        customer.setCustomerKey("C123");
        customer.setCustomerId("CUST001");
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setAddressLine1("123 Main St");
        customer.setAddressLine2("Apt 456");
        customer.setCity("New York");
        customer.setState("NY");
        customer.setZipCode("10001");
        customer.setCountry("USA");
        customer.setPhoneNo("+1 123-456-7890");
        customer.setEmailId("johndoe@example.com");
        customer.setStatus("Active");

        assertEquals("C123", customer.getCustomerKey());
        assertEquals("CUST001", customer.getCustomerId());
        assertEquals("John", customer.getFirstName());
        assertEquals("Doe", customer.getLastName());
        assertEquals("123 Main St", customer.getAddressLine1());
        assertEquals("Apt 456", customer.getAddressLine2());
        assertEquals("New York", customer.getCity());
        assertEquals("NY", customer.getState());
        assertEquals("10001", customer.getZipCode());
        assertEquals("USA", customer.getCountry());
        assertEquals("+1 123-456-7890", customer.getPhoneNo());
        assertEquals("johndoe@example.com", customer.getEmailId());
        assertEquals("Active", customer.getStatus());
    }
}
