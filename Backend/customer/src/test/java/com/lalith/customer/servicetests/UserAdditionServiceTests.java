package com.lalith.customer.servicetests;

import com.lalith.customer.dto.AuthenticationResponse;
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
        userInfo.setEmail("testuser@gmail.com");
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

    @Test
    public void testAddUserWithValidData() {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("testuser");
        userInfo.setPassword("password");
        userInfo.setEmail("testuser@example.com");

        when(passwordEncoder.encode(userInfo.getPassword())).thenReturn("encodedPassword");

        when(repository.findByName(userInfo.getName())).thenReturn(java.util.Optional.empty());
        when(repository.findByEmail(userInfo.getEmail())).thenReturn(java.util.Optional.empty());

        when(repository.save(userInfo)).thenReturn(userInfo);

        when(jwtService.generateToken(userInfo.getName())).thenReturn("jwtToken");

        AuthenticationResponse response = userAdditionService.addUser(userInfo);

        verify(passwordEncoder, times(1)).encode("password");
        verify(repository, times(2)).findByName(userInfo.getName());
        verify(repository, times(1)).findByEmail(userInfo.getEmail());
        verify(repository, times(1)).save(userInfo);
        verify(jwtService, times(1)).generateToken(userInfo.getName());

        assertNotNull(response);
        assertEquals("jwtToken", response.getToken());
        assertEquals("testuser", response.getName());
    }

    @Test
    public void testAddUserWithDuplicateUsername() {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("testuser");
        userInfo.setPassword("password");
        userInfo.setEmail("testuser@example.com");

        when(repository.findByName(userInfo.getName())).thenReturn(java.util.Optional.of(userInfo));

        assertThrows(IllegalArgumentException.class, () -> userAdditionService.addUser(userInfo));

        verify(repository, times(2)).findByName(userInfo.getName());
        verifyNoMoreInteractions(passwordEncoder, jwtService);
    }

    @Test
    public void testAddUserWithDuplicateEmail() {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("testuser");
        userInfo.setPassword("password");
        userInfo.setEmail("testuser@example.com");

        when(repository.findByEmail(userInfo.getEmail())).thenReturn(java.util.Optional.of(userInfo));

        assertThrows(IllegalArgumentException.class, () -> userAdditionService.addUser(userInfo));

        verify(repository, times(1)).findByEmail(userInfo.getEmail());
        verifyNoMoreInteractions(passwordEncoder, jwtService);
    }
}
