package com.kodprodobro.kodprodobro.security.services;


import com.kodprodobro.kodprodobro.models.RevokedToken;
import com.kodprodobro.kodprodobro.repositories.RevokedTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class BlacklistService {

    private final RevokedTokenRepository repository;
    // Implementace blacklistu (např. pro zablokované tokeny)
    public void blacklistToken(String token, Instant expirationDate) {
        // Logika pro přidání tokenu do blacklistu
        RevokedToken revokedToken = new RevokedToken(token, expirationDate);
        repository.save(revokedToken);
    }

    public boolean isTokenBlacklisted(String token) {
        return repository.existsByToken(token);
    }
}
