package com.lalith.customer.servicetests;

import com.lalith.customer.service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JwtServiceTests {

    private JwtService jwtService;

    private static final String SECRET = "614E645267556B58703273357638792F423F4528482B4D6251655368566D5971";

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
        Date expirationDate = new Date(currentTimeMillis + 1000 * 60 * 150);
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
        Date expirationDate = new Date(System.currentTimeMillis() - 1000*60*150); // Set expiration 1 hour ago
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
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", username);
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + +1000*60*150))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    private String createTestTokenWithExpiration(Date expirationDate) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(expirationDate)
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    private Key getSignKey() {
        byte[] keyBytes= Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
