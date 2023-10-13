package com.lalith.customer.service;

import com.lalith.customer.model.AuthenticationResponse;
import com.lalith.customer.model.UserInfo;
import com.lalith.customer.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAdditionService {
    @Autowired
    private UserInfoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    public AuthenticationResponse addUser(UserInfo userInfo) {
            if (!userInfo.getName().matches("^[a-zA-Z0-9]+$")) {
                throw new IllegalArgumentException("Username should contain only letters and numbers.");
            }

            String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
            if (!userInfo.getEmail().matches(emailRegex)) {
                throw new IllegalArgumentException("Invalid email format.");
            }

            if (repository.findByName(userInfo.getName()).isPresent()) {
                throw new IllegalArgumentException("Username already exists.");
            }

            if (repository.findByEmail(userInfo.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already exists.");
            }

           userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
           repository.save(userInfo);
           String jwt = jwtService.generateToken(userInfo.getName());
           return new AuthenticationResponse(jwt,userInfo.getName());
    }
}
