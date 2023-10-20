package com.lalith.customer.servicetests;

import com.lalith.customer.repository.UserInfoRepository;
import com.lalith.customer.service.UserInfoUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserInfoUserDetailsServiceTests {

    private UserInfoUserDetailsService userDetailsService;

    @Mock
    private UserInfoRepository userInfoRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        userDetailsService = new UserInfoUserDetailsService(userInfoRepository);
    }

    @Test
    public void testLoadUserByUsernameUserNotFound() {
        String username = "nonexistentuser";

        when(userInfoRepository.findByName(username)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername(username);
        });
    }
}
