package com.kodprodobro.kodprodobro.controllers;

import com.kodprodobro.kodprodobro.dto.auth.LoginRequest;
import com.kodprodobro.kodprodobro.dto.MessageResponse;
import com.kodprodobro.kodprodobro.dto.SignupRequest;
import com.kodprodobro.kodprodobro.models.enums.Role;
import com.kodprodobro.kodprodobro.models.User;
import com.kodprodobro.kodprodobro.repositories.RoleRepository;
import com.kodprodobro.kodprodobro.repositories.UserRepository;
import com.kodprodobro.kodprodobro.security.JwtTokenProvider;
import com.kodprodobro.kodprodobro.security.services.BlacklistService;
import com.kodprodobro.kodprodobro.services.email.EmailService;
import com.kodprodobro.kodprodobro.services.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;


@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    private final EmailService emailService;

    private final UserService userService;

    private final BlacklistService blacklistService;


    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        log.info("POST /api/auth/login - Pokus o přihlášení uživatele: {}", loginRequest.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtTokenProvider.generateToken(authentication);

            log.info("Uživatel {} byl úspěšně přihlášen.", loginRequest.getUsername());
            User userDetails = (User) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "token", jwt,
                    "username", userDetails.getUsername(),
                    "roles", userDetails.getAuthorities()
            ));
        } catch (AuthenticationException e) {
            log.error("Chyba při přihlášení uživatele {}: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED) // 401 Unauthorized
                    .body(new MessageResponse("Chyba: Neplatné uživatelské jméno nebo heslo!"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        log.info("POST /api/auth/register - Pokus o registraci uživatele: {}", signUpRequest.getUsername());
        try {
            // Registrace nového uživatele
            userService.registerNewUser(signUpRequest);
            log.info("Uživatel {} byl úspěšně zaregistrován.", signUpRequest.getUsername());
            return ResponseEntity.ok(new MessageResponse("Uživatel byl úspěšně zaregistrován!"));
        } catch (IllegalArgumentException e) {
            // Odchytit chyby jako duplicitní uživatelské jméno/email
            log.error("Chyba při registraci uživatele {}: {}", signUpRequest.getUsername(), e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Chyba: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        log.info("POST /api/auth/forgot-password - Požadavek na reset hesla pro email: {}", email);
        if (email == null || email.isBlank()) {
            log.warn("Požadavek na reset hesla selhal: Emailová adresa je prázdná.");
            return ResponseEntity.badRequest().body(Map.of("error", "Emailová adresa nesmí být prázdná."));
        }
        try {
            String token = userService.createPasswordResetTokenForUser(email);
            String resetUrl = frontendUrl + "/reset-password?token" + token;
            emailService.sendPasswordResetEmail(email, resetUrl);
            log.info("Odkaz pro reset hesla byl odeslán na email: {}", email);

        } catch (Exception e) {
            log.error("Chyba při zpracování požadavku na reset hesla pro email {}: {}", email, e.getMessage());
        }
        return ResponseEntity.ok(Map.of("message", "Pokud je tento e-mail registrován, instrukce byly odeslány."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        log.info("POST /api/auth/reset-password - Pokus o reset hesla s tokenem: {}", token);
        try {
            userService.resetPassword(token, newPassword);
            log.info("Heslo pro token {} bylo úspěšně resetováno.", token);
            return ResponseEntity.ok(Map.of("message", "Password has been reset successfully."));
        } catch (IllegalArgumentException e) {
            log.error("Chyba při resetu hesla s tokenem {}: {}", token, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Odhlášení uživatele (blacklist tokenu)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal Jwt jwt) {
        log.info("POST /api/auth/logout - Požadavek na odhlášení uživatele. {}", jwt.getSubject());

        String token = jwt.getTokenValue();
        Instant expiration = jwt.getExpiresAt();

        blacklistService.blacklistToken(token, expiration);
        log.info("Token pro uživatele {} byl přidán do blacklistu.", jwt.getSubject());

        return ResponseEntity.ok(Map.of("message", "Úspěšně odhlášeno"));
    }
}
