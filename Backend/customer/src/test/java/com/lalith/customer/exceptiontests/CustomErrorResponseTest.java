package com.lalith.customer.exceptiontests;

import com.lalith.customer.exception.CustomErrorResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CustomErrorResponseTest {

    @Test
    public void testGetMessage() {
        String expectedMessage = "Test Message";
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(expectedMessage);

        String actualMessage = customErrorResponse.getMessage();

        assertEquals(expectedMessage, actualMessage);
    }

    @Test
    public void testSetMessage() {
        String initialMessage = "Initial Message";
        String newMessage = "New Message";
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(initialMessage);

        customErrorResponse.setMessage(newMessage);
        String updatedMessage = customErrorResponse.getMessage();

        assertEquals(newMessage, updatedMessage);
    }
}
