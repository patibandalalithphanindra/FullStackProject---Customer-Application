package com.lalith.customer.controllertests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lalith.customer.controller.UserController;
import com.lalith.customer.dto.AuthRequest;
import com.lalith.customer.model.AuthenticationResponse;
import com.lalith.customer.model.UserInfo;
import com.lalith.customer.service.JwtService;
import com.lalith.customer.service.UserAdditionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerTests {

    @Mock
    private UserAdditionService userAdditionService;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    public void testAddNewUser() throws Exception {
        when(userAdditionService.addUser(any(UserInfo.class))).thenReturn(new AuthenticationResponse("token", "username"));

        mockMvc.perform(post("/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(new UserInfo())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token"));

        verify(userAdditionService, times(1)).addUser(any(UserInfo.class));
    }

    @Test
    public void testAuthenticationFailure() throws Exception {
        AuthRequest authRequest = new AuthRequest();
        authRequest.setName("testuser");
        authRequest.setPassword("invalidpassword"); // Invalid password

        Mockito.when(authenticationManager.authenticate(any()))
                .thenThrow(new UsernameNotFoundException("Invalid User Request!"));

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        mockMvc.perform(MockMvcRequestBuilders.post("/user/authenticate")
                        .contentType("application/json")
                        .content("{\"name\":\"testuser\",\"password\":\"invalidpassword\"}"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized()) // Expect HTTP 401 Unauthorized
                .andExpect(MockMvcResultMatchers.content().string("{\"token\":null,\"name\":\"Invalid User Request!\"}"));
    }

    @Test
    public void testAuthenticationSuccess() throws Exception {
        AuthRequest authRequest = new AuthRequest();
        authRequest.setName("testuser");
        authRequest.setPassword("validpassword");

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "testuser",
                "validpassword",
                new ArrayList<>()
        );

        Mockito.when(authenticationManager.authenticate(any()))
                .thenReturn(authentication);

        Mockito.when(jwtService.generateToken("testuser")).thenReturn("mocked-token");

        mockMvc.perform(post("/user/authenticate")
                        .contentType("application/json")
                        .content("{\"name\":\"testuser\",\"password\":\"validpassword\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("{\"token\":\"mocked-token\",\"name\":\"testuser\"}"));
    }


}

