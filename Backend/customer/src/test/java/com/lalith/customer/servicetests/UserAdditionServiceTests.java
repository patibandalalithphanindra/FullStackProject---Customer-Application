package com.lalith.customer.servicetests;

import com.lalith.customer.model.AuthenticationResponse;
import com.lalith.customer.model.UserInfo;
import com.lalith.customer.repository.UserInfoRepository;
import com.lalith.customer.service.JwtService;
import com.lalith.customer.service.UserAdditionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserAdditionServiceTests {

    @InjectMocks
    private UserAdditionService userAdditionService;

    @Mock
    private UserInfoRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testAddUser() {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("testuser");
        userInfo.setPassword("password");

        when(passwordEncoder.encode(userInfo.getPassword())).thenReturn("encodedPassword");

        when(repository.save(userInfo)).thenReturn(userInfo);

        when(jwtService.generateToken(userInfo.getName())).thenReturn("jwtToken");

        AuthenticationResponse response = userAdditionService.addUser(userInfo);

        verify(passwordEncoder, times(1)).encode("password");

        verify(repository, times(1)).save(userInfo);

        verify(jwtService, times(1)).generateToken(userInfo.getName());

        assertNotNull(response);
        assertEquals("jwtToken", response.getToken());
        assertEquals("testuser", response.getName());
    }
}
