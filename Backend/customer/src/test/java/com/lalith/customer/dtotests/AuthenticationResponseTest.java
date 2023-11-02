package com.lalith.customer.dtotests;

import com.lalith.customer.dto.AuthenticationResponse;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class AuthenticationResponseTest {

    @Test
    public void testAuthenticationResponseModel() {
        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken("testToken");
        response.setName("John Doe");

        assertEquals("testToken", response.getToken());
        assertEquals("John Doe", response.getName());
    }

    @Test
    public void testTokenSetterGetter() {
        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken("testToken");
        assertEquals("testToken", response.getToken());
    }

    @Test
    public void testNameSetterGetter() {
        AuthenticationResponse response = new AuthenticationResponse();
        response.setName("John Doe");
        assertEquals("John Doe", response.getName());
    }

    @Test
    public void testEqualsAndHashCode() {
        AuthenticationResponse response1 = new AuthenticationResponse("token1", "John Doe");
        AuthenticationResponse response2 = new AuthenticationResponse("token1", "John Doe");

        assertTrue(response1.equals(response2));
        assertTrue(response2.equals(response1));
        assertEquals(response1.hashCode(), response2.hashCode());
    }

    @Test
    public void testNotEquals() {
        AuthenticationResponse response1 = new AuthenticationResponse("token1", "John Doe");
        AuthenticationResponse response2 = new AuthenticationResponse("token2", "Jane Smith");

        assertFalse(response1.equals(response2));
        assertFalse(response2.equals(response1));
    }

    @Test
    public void testToString() {
        AuthenticationResponse response = new AuthenticationResponse("testToken", "John Doe");
        String expected = "AuthenticationResponse(token=testToken, name=John Doe)";
        assertEquals(expected, response.toString());
    }
}
