package com.lalith.customer.servicetests;

import com.lalith.customer.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JwtServiceTests {

    private JwtService jwtService;

    @BeforeEach
    public void setUp() {
        jwtService = new JwtService();
    }



    @Test
    public void testExtractName() {
        String username = "testuser";
        String token = createTestToken(username);

        String extractedName = jwtService.extractName(token);

        assertEquals(username, extractedName);
    }

    @Test
    public void testExtractExpiration() {
        long currentTimeMillis = System.currentTimeMillis();
        Date expirationDate = new Date(currentTimeMillis + 1000 * 60 * 300);
        String token = createTestTokenWithExpiration(expirationDate);

        Date extractedExpiration = jwtService.extractExpiration(token);

        long tolerance = 1000;
        assertTrue(Math.abs(expirationDate.getTime() - extractedExpiration.getTime()) <= tolerance);
    }

    @Test
    public void testValidateTokenValid() {
        String username = "testuser";

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(username);

        String token = createTestToken(username);

        boolean isValid = jwtService.validateToken(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    public void testValidateTokenExpired() {
        String username = "testuser";
        Date expirationDate = new Date(System.currentTimeMillis() - 1000 * 60 * 300);
        String token = createTestTokenWithExpiration(expirationDate);
        User userDetails = mock(User.class);

        assertThrows(ExpiredJwtException.class, () -> jwtService.validateToken(token, userDetails));
    }

    @Test
    public void testGenerateToken() {
        String username = "testuser";

        String token = jwtService.generateToken(username);

        assertNotNull(token);
    }

    private String createTestToken(String username) {
        Claims claims = createClaims(username);
        return Jwts.builder()
                .setClaims(claims)
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    private String createTestTokenWithExpiration(Date expirationDate) {
        Claims claims = createClaims("testuser");
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(expirationDate)
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    private Claims createClaims(String userName) {
        Claims claims = Jwts.claims();
        claims.setSubject(userName);
        claims.setIssuedAt(new Date());
        claims.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 300));
        return claims;
    }

    @Test
    public void testExtractClaim() {
        String username = "testuser";
        Claims claims = createClaims(username);
        String token = Jwts.builder()
                .setClaims(claims)
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();

        String extractedName = jwtService.extractClaim(token, Claims::getSubject);

        assertEquals(username, extractedName);
    }


    private Key getSignKey() {
        return Keys.hmacShaKeyFor(JwtService.SECRET.getBytes());
    }
}
