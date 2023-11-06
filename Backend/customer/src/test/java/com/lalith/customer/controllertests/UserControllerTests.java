package com.lalith.customer.controllertests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lalith.customer.controller.UserController;
import com.lalith.customer.dto.AuthRequest;
import com.lalith.customer.dto.AuthenticationResponse;
import com.lalith.customer.exception.CustomErrorResponse;
import com.lalith.customer.model.UserInfo;
import com.lalith.customer.service.JwtService;
import com.lalith.customer.service.UserAdditionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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

        UserInfo validUserInfo = new UserInfo();
        validUserInfo.setName("validusername");
        validUserInfo.setEmail("valid@example.com");

        mockMvc.perform(post("/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(validUserInfo)))
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

    @Test
    public void testAddNewUserInvalidUsername() throws Exception {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("lalith_!@#");
        userInfo.setEmail("valid@email.com");
        userInfo.setPassword("password");

        mockMvc.perform(post("/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(userInfo))
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Username should contain only letters and numbers."));
    }

    @Test
    public void testInvalidEmail() throws Exception {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("validusername");
        userInfo.setEmail("invalid-email");

        mockMvc.perform(post("/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(userInfo))
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid email format."));
    }

    @Test
    public void testInvalidUsernameAndEmail() throws Exception {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("invalid_username");
        userInfo.setEmail("invalid-email");

        mockMvc.perform(post("/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(userInfo))
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Username should contain only letters and numbers and Email should be of valid format"));
    }

}

