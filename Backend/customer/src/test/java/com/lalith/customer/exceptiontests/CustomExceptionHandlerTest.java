package com.lalith.customer.exceptiontests;

import com.lalith.customer.exception.CustomErrorResponse;
import com.lalith.customer.exception.CustomExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CustomExceptionHandlerTest {

    @Test
    public void handleResponseStatusException_NotFound() {
        CustomExceptionHandler exceptionHandler = new CustomExceptionHandler();
        ResponseStatusException ex = new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found");

        ResponseEntity<CustomErrorResponse> response = exceptionHandler.handleResponseStatusException(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Resource not found! Resource not found", response.getBody().getMessage());
    }

    @Test
    public void handleResponseStatusException_Unauthorized() {
        CustomExceptionHandler exceptionHandler = new CustomExceptionHandler();
        ResponseStatusException ex = new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized Access");

        ResponseEntity<CustomErrorResponse> response = exceptionHandler.handleResponseStatusException(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Unauthorized Access! Unauthorized Access", response.getBody().getMessage());
    }

    @Test
    public void handleResponseStatusException_OtherStatus() {
        CustomExceptionHandler exceptionHandler = new CustomExceptionHandler();
        ResponseStatusException ex = new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad Request");

        ResponseEntity<CustomErrorResponse> response = exceptionHandler.handleResponseStatusException(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Bad Request", response.getBody().getMessage());
    }
}
