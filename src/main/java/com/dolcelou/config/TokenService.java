package com.dolcelou.config;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    private final Map<String, TokenData> tokens = new ConcurrentHashMap<>();
    private static final long TTL_SECONDS = 8 * 60 * 60;

    public String create(String userId, String email, String role) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenData(userId, email, role, Instant.now().plusSeconds(TTL_SECONDS)));
        return token;
    }

    public Authentication authenticate(String token) {
        TokenData data = tokens.get(token);
        if (data == null || data.expiresAt().isBefore(Instant.now())) {
            tokens.remove(token);
            return null;
        }
        return new UsernamePasswordAuthenticationToken(data.userId(), null,
            java.util.List.of(new SimpleGrantedAuthority("ROLE_" + data.role())));
    }

    public void revoke(String token) { tokens.remove(token); }
    private record TokenData(String userId, String email, String role, Instant expiresAt) {}
}
