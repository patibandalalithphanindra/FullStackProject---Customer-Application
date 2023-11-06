package com.lalith.customer.controller;

import com.lalith.customer.dto.AuthRequest;
import com.lalith.customer.dto.AuthenticationResponse;
import com.lalith.customer.exception.CustomErrorResponse;
import com.lalith.customer.model.UserInfo;
import com.lalith.customer.service.JwtService;
import com.lalith.customer.service.UserAdditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserAdditionService userAdditionService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/add")
    public ResponseEntity<?>  addNewUser(@RequestBody UserInfo userInfo) {
        if (!userInfo.getName().matches("^[a-zA-Z0-9]+$") && !userInfo.getEmail().matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
            CustomErrorResponse errorResponse = new CustomErrorResponse("Username should contain only letters and numbers and Email should be of valid format");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        if (!userInfo.getName().matches("^[a-zA-Z0-9]+$")) {
            CustomErrorResponse errorResponse = new CustomErrorResponse("Username should contain only letters and numbers.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        if (!userInfo.getEmail().matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
            CustomErrorResponse errorResponse = new CustomErrorResponse("Invalid email format.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        try {
            AuthenticationResponse response = userAdditionService.addUser(userInfo);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getName(), authRequest.getPassword()));
            if (authentication.isAuthenticated()) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
                return ResponseEntity.ok(new AuthenticationResponse(jwtService.generateToken(authRequest.getName()), authRequest.getName()));
            }
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthenticationResponse(null, e.getMessage()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthenticationResponse(null, "Authentication failed"));
    }


}
