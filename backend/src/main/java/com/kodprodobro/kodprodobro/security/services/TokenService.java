package com.kodprodobro.kodprodobro.security.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
public class TokenService {
    private final JwtEncoder encoder;

    public TokenService(JwtEncoder encoder) {
        this.encoder = encoder;
    }

    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();

        // Získání rolí a jejich spojení do jednoho stringu (např. "ROLE_USER ROLE_ADMIN")
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        // Vytvoření obsahu tokenu (Claims)
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")              // Kdo token vydal
                .issuedAt(now)               // Kdy byl vydán
                .expiresAt(now.plus(1, ChronoUnit.HOURS)) // Kdy vyprší (např. za 1 hodinu)
                .subject(authentication.getName()) // Username
                .claim("scope", scope)       // Role (OAuth2 standardně používá "scope" nebo "scp")
                .build();

        // Parametry pro podepsání (hlavička + obsah)
        // Důležité: Musí specifikovat algoritmus HS512, aby seděl ke klíči
        JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS512).build();

        return encoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

}
