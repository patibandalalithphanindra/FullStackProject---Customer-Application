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
        customer.setFirstName("Lalith");
        customer.setLastName("Phanindra");
        customer.setAddressLine1("123 Main St");
        customer.setAddressLine2("Apt 456");
        customer.setCity("Khammam");
        customer.setState("Telangana");
        customer.setZipCode("507002");
        customer.setCountry("India");
        customer.setPhoneNo("7891234550");
        customer.setEmailId("plp@gmail.com");
        customer.setStatus("Active");

        assertEquals("C123", customer.getCustomerKey());
        assertEquals("CUST001", customer.getCustomerId());
        assertEquals("Lalith", customer.getFirstName());
        assertEquals("Phanindra", customer.getLastName());
        assertEquals("123 Main St", customer.getAddressLine1());
        assertEquals("Apt 456", customer.getAddressLine2());
        assertEquals("Khammam", customer.getCity());
        assertEquals("Telangana", customer.getState());
        assertEquals("507002", customer.getZipCode());
        assertEquals("India", customer.getCountry());
        assertEquals("7891234550", customer.getPhoneNo());
        assertEquals("plp@gmail.com", customer.getEmailId());
        assertEquals("Active", customer.getStatus());
    }

}
