package com.lalith.customer.service;

import com.lalith.customer.dto.AuthenticationResponse;
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
        if (repository.findByName(userInfo.getName()).isPresent() && repository.findByEmail(userInfo.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Username and email already exists.");
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
        return new AuthenticationResponse(jwt, userInfo.getName());
    }
}
