package com.kodprodobro.kodprodobro.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kodprodobro.kodprodobro.dto.auth.LoginRequest;
import com.kodprodobro.kodprodobro.dto.SignupRequest;
import com.kodprodobro.kodprodobro.models.User;
import com.kodprodobro.kodprodobro.security.SecurityConfig;
import com.kodprodobro.kodprodobro.security.services.BlacklistService;
import com.kodprodobro.kodprodobro.security.services.TokenService;
import com.kodprodobro.kodprodobro.services.email.EmailService;
import com.kodprodobro.kodprodobro.services.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
        "jwt.secret=mySuperSecretKeyForTestingPurposesThatIsLongEnough123456789",
        "app.frontend.url=http://localhost:3000"
})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private EmailService emailService;

    @MockBean
    private UserService userService;

    @MockBean
    private BlacklistService blacklistService;

    @Test
    void authenticateUser_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        User mockUser = new User();
        mockUser.setUsername("testuser");
        // User authorities logic in controller expects this
        // assuming User implementation or how controller casts it.
        // Based on controller code: User userDetails = (User)
        // authentication.getPrincipal();
        // and userDetails.getAuthorities() used.
        // User typically extends/implements Spring Security UserDetails.

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                mockUser, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));

        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .willReturn(authentication);
        given(tokenService.generateToken(authentication)).willReturn("mock-token");

        mockMvc.perform(post("/api/auth/login")
                .with(csrf()) // standard since security config might expect it or ignore it but safe to have
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-token"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.roles[0].authority").value("ROLE_USER"));
    }

    @Test
    void authenticateUser_Failure() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("wrong");
        loginRequest.setPassword("wrong");

        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .willThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Chyba: Neplatné uživatelské jméno nebo heslo!"));
    }

    @Test
    void registerUser_Success() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("new@example.com");
        signupRequest.setPassword("password");

        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Uživatel byl úspěšně zaregistrován!"));

        verify(userService).registerNewUser(any(SignupRequest.class));
    }

    @Test
    void registerUser_Failure_Duplicate() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("existing");

        // Assuming userService throws IllegalArgumentException for duplicates as per
        // controller code
        org.mockito.Mockito.doThrow(new IllegalArgumentException("Username is already taken!"))
                .when(userService).registerNewUser(any(SignupRequest.class));

        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Chyba: Username is already taken!"));
    }

    @Test
    void forgotPassword_Success() throws Exception {
        Map<String, String> request = Map.of("email", "user@example.com");
        String mockToken = "reset-token";

        given(userService.createPasswordResetTokenForUser("user@example.com")).willReturn(mockToken);

        mockMvc.perform(post("/api/auth/forgot-password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());

        verify(emailService).sendPasswordResetEmail(eq("user@example.com"), any(String.class));
    }

    @Test
    void resetPassword_Success() throws Exception {
        Map<String, String> request = Map.of(
                "token", "valid-token",
                "newPassword", "newPass123");

        mockMvc.perform(post("/api/auth/reset-password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password has been reset successfully."));

        verify(userService).resetPassword("valid-token", "newPass123");
    }

    @Test
    void logout_Success() throws Exception {
        // Mock authenticated user via JWT
        mockMvc.perform(post("/api/auth/logout")
                .with(jwt().jwt(jwt -> jwt.claim("sub", "user")))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Úspěšně odhlášeno"));

        verify(blacklistService).blacklistToken(any(), any());
    }
}
