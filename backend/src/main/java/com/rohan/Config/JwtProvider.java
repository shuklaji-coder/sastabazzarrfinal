package com.rohan.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;
@Service
public class JwtProvider {

    SecretKey key = Keys.hmacShaKeyFor(Jwt_Constant.SECRET_KEY.getBytes());

    public String generateToken(Authentication authentication) {

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roles = populateAuthorities(authorities);

        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .claim("email", authentication.getName())
                .claim("authorities", roles)   // ✅ fixed spelling
                .signWith(key)
                .compact();
    }
    public String getEmailFromToken(String jwt) {
        jwt= jwt.substring(7);


        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();


        String email = claims.get("email").toString();
       return email;
    }

    // ✅ THIS METHOD WAS MISSING
    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {

        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
    }
}
