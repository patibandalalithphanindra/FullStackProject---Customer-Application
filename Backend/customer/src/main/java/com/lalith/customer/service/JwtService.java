package com.lalith.customer.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtService {
    public static final String SECRET = "6A1F4D7E0B2C5A8F3E9D7C8F2A5D7B9C61AE1C6F2B8D9E4F87B9C7D6E5F6A7B5";
    byte[] encodedSecret = Base64.getEncoder().encode(SECRET.getBytes());
    String base64Secret = new String(encodedSecret);

    public String extractName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String name) {
        Claims claims = createClaims(name);
        return createToken(claims);
    }

    private Claims createClaims(String userName) {
        Claims claims = Jwts.claims();
        claims.setSubject(userName);
        claims.setIssuedAt(new Date());
        claims.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 300));
        return claims;
    }

    private String createToken(Claims claims) {
        return Jwts.builder()
                .setHeaderParam("alg", "HS256")
                .setHeaderParam("typ", "JWT")
                .setClaims(claims)
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Base64.getDecoder().decode(base64Secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
