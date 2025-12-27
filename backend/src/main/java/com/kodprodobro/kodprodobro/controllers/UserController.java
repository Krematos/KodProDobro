package com.kodprodobro.kodprodobro.controllers;

import com.kodprodobro.kodprodobro.dto.UserProfileRequest;
import com.kodprodobro.kodprodobro.models.User;
import com.kodprodobro.kodprodobro.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        log.info("GET /api/users/me - Získání informací o přihlášeném uživateli");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        String username = jwt.getSubject();

        User user = userRepository.findByUsername(currentPrincipalName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok("Přihlášený uživatel: " + user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(@RequestBody UserProfileRequest profileRequest) {
        log.info("PUT /api/users/me - Aktualizace profilu uživatele: {}", profileRequest.getEmail());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        User user = userRepository.findByUsername(currentPrincipalName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(profileRequest.getFirstName());
        user.setLastName(profileRequest.getLastName());
        user.setEmail(profileRequest.getEmail());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }
}
