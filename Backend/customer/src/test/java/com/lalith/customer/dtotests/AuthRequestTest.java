package com.lalith.customer.dtotests;

import com.lalith.customer.dto.AuthRequest;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class AuthRequestTest {

    @Test
    public void testAuthRequestModel() {
        AuthRequest authRequest = new AuthRequest();
        authRequest.setName("John Doe");
        authRequest.setPassword("password");

        assertEquals("John Doe", authRequest.getName());
        assertEquals("password", authRequest.getPassword());
    }

    @Test
    public void testNameSetterGetter() {
        AuthRequest authRequest = new AuthRequest();
        authRequest.setName("John Doe");
        assertEquals("John Doe", authRequest.getName());
    }

    @Test
    public void testPasswordSetterGetter() {
        AuthRequest authRequest = new AuthRequest();
        authRequest.setPassword("password");
        assertEquals("password", authRequest.getPassword());
    }

    @Test
    public void testEqualsAndHashCode() {
        AuthRequest authRequest1 = new AuthRequest("John Doe", "password");
        AuthRequest authRequest2 = new AuthRequest("John Doe", "password");

        assertTrue(authRequest1.equals(authRequest2));
        assertTrue(authRequest2.equals(authRequest1));
        assertEquals(authRequest1.hashCode(), authRequest2.hashCode());
    }

    @Test
    public void testNotEquals() {
        AuthRequest authRequest1 = new AuthRequest("John Doe", "password");
        AuthRequest authRequest2 = new AuthRequest("Jane Smith", "newpassword");

        assertFalse(authRequest1.equals(authRequest2));
        assertFalse(authRequest2.equals(authRequest1));
    }

    @Test
    public void testToString() {
        AuthRequest authRequest = new AuthRequest("John Doe", "password");
        String expected = "AuthRequest(name=John Doe, password=password)";
        assertEquals(expected, authRequest.toString());
    }
}
