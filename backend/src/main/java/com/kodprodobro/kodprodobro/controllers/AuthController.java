package com.kodprodobro.kodprodobro.controllers;

import com.kodprodobro.kodprodobro.dto.message.MessageResponse;
import com.kodprodobro.kodprodobro.dto.security.JwtResponse;
import com.kodprodobro.kodprodobro.dto.security.TokenValidationResponse;
import com.kodprodobro.kodprodobro.dto.auth.LoginRequest;
import com.kodprodobro.kodprodobro.dto.auth.RegisterRequest;
import com.kodprodobro.kodprodobro.models.user.User;
import com.kodprodobro.kodprodobro.services.JwtService;
import com.kodprodobro.kodprodobro.services.user.UserDetailsImpl;
import com.kodprodobro.kodprodobro.services.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;


@Tag(name = "Authentication", description = "Endpointy pro autentizaci uživatelů a registraci")
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;
    @Value("${app.frontend.url}")
    private String frontendUrl;

    /**
     * ✅ Registrace nového uživatele
     *
     * @param request
     * @return
     */
    @Operation(summary = "Registrace nového uživatele", description = "Vytvoří nový účet pro zákazníka. Vyžaduje unikátní email a username.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Uživatel úspěšně vytvořen"),
            @ApiResponse(responseCode = "400", description = "Chyba validace (krátké heslo, špatný email)"),
            @ApiResponse(responseCode = "409", description = "Konflikt - email nebo username již existuje")
    })
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/auth/register - Pokus o registraci uživatele: {}", request.username());
        User userToRegister = User.builder()
                .username(request.username())
                .email(request.email())
                .password(request.password()) // Heslo se zahashuje až v Service
                .build();
        userService.registerNewUser(userToRegister);
        return ResponseEntity.ok(Map.of("message", "Registrace proběhla úspěšně"));
    }

    /**
     * 🔑 Přihlášení uživatele a získání JWT tokenu
     *
     * @param loginRequest Přihlašovací údaje (username a heslo)
     * @return JWT token a informace o uživateli
     */
    @Operation(summary = "Přihlášení uživatele", description = "Autentizuje uživatele pomocí username a hesla. " +
            "Vrací JWT access token, který se používá pro autorizaci dalších požadavků.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Úspěšné přihlášení, vrací JWT token", content = @Content(mediaType = "application/json", schema = @Schema(implementation = JwtResponse.class), examples = @ExampleObject(value = "{\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",\"username\":\"user@example.com\",\"authorities\":[{\"authority\":\"ROLE_USER\"}]}"))),
            @ApiResponse(responseCode = "401", description = "Neplatné přihlašovací údaje", content = @Content),
            @ApiResponse(responseCode = "400", description = "Chybějící nebo neplatná data v požadavku", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("POST /api/auth/login - Pokus o přihlášení uživatele: {}", loginRequest.username());
        // 1. Autentizace uživatele
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()));
        // 2. Nastavení kontextu pro aktuální vlákno
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Získání detailů uživatele (UserDetails)
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // 4. Generování JWT tokenu
        String jwt = jwtService.generateAccessToken(userDetails.getUsername());

        // 5. Návrat odpovědi s tokenem
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), userDetails.getAuthorities()));

    }

    /**
     * ✅ Ověření JWT tokenu (např. pro FE)
     *
     * @param token JWT token k ověření
     * @return Odpověď s informací o platnosti tokenu
     */
    @Operation(summary = "Validace JWT tokenu", description = "Ověří platnost JWT tokenu. " +
            "Vrací informaci, zda je token validní, včetně uživatelského jména a rolí.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token byl ověřen (může být validní i nevalidní - viz response body)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = TokenValidationResponse.class), examples = {
                    @ExampleObject(name = "Validní token", value = "{\"valid\":true,\"username\":\"user@example.com\",\"roles\":[\"ROLE_USER\"]}"),
                    @ExampleObject(name = "Nevalidní token", value = "{\"valid\":false,\"username\":null,\"roles\":null}")
            }))
    })
    @GetMapping("/validate")
    public ResponseEntity<TokenValidationResponse> validateToken(
            @Parameter(description = "JWT token k validaci (bez 'Bearer ' prefixu)", required = true, example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") @RequestHeader String token) {
        log.info("GET /api/auth/validate - Pokus o validaci tokenu");
        try {
            // musí vytáhnout username z tokenu, aby mohl zavolat validateToken
            String username = jwtService.extractUsername(token);
            // Volá metodu z JwtService
            boolean isValid = jwtService.validateToken(token, username);
            if (!isValid) {
                return ResponseEntity.ok(new TokenValidationResponse(false, null, null));
            }
            // Získání rolí uživatele z tokenu (pokud jsou uloženy v tokenu)
            List<String> rawRoles = jwtService.extractRoles(token);

            Set<String> roles = new HashSet<>(rawRoles);


            // Token je validní
            return ResponseEntity.ok(new TokenValidationResponse(true, username, roles));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * ✅ Odhlášení uživatele
     *
     * @param request HTTP požadavek obsahující Authorization header s JWT tokenem
     * @return Potvrzení o úspěšném odhlášení
     */
    @Operation(summary = "Odhlášení uživatele", description = "Odhlásí uživatele přidáním jeho JWT tokenu na černou listinu (blacklist). "
            +
            "Token musí být zaslán v Authorization headeru s prefixem 'Bearer '.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Úspěšné odhlášení, token byl přidán na blacklist", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"message\":\"Úspěšně odhlášeno\"}"))),
            @ApiResponse(responseCode = "400", description = "Chybí token v Authorization headeru", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"error\":\"Chybí token\"}")))
    })
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@CookieValue(name = "accessToken", required = false) String token,
            @Parameter(hidden = true) // Skryje HttpServletRequest ve Swagger UI
            HttpServletRequest request) {
        log.info("POST /api/auth/logout - Uživatelský odhlášení");
        // 1. Pokud token existuje, přidá ho na Blacklist
        if (token != null) {
            jwtService.isTokenBlacklisted(token);
        }

        // 2. Vytvoří "mazací" cookie
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .path("/")
                .maxAge(0) // Okamžitá smrt
                .httpOnly(true)
                .build();

        // 3. Vrátí odpověď
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("Úspěšné odhlášení"));
    }
}
