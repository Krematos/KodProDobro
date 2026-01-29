package com.kodprodobro.kodprodobro.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    // --- 1. TESTY VEŘEJNÝCH ENDPOINTŮ (PUBLIC) ---

    @Test
    @DisplayName("Veřejný endpoint /api/products by měl být dostupný bez přihlášení (200 OK)")
    void shouldAllowAccessToPublicEndpoint() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Swagger API Docs by měl být veřejně přístupný (Security check)")
    void shouldAllowAccessToSwagger() throws Exception {
        mockMvc.perform(get("/api-docs"))
                .andExpect(status().is(not(401)))
                .andExpect(status().is(not(403)));
    }

    @Test
    @DisplayName("Login endpoint by měl být dostupný (i když tělo requestu chybí/je špatné, nesmí vrátit 401/403)")
    void shouldAllowAccessToAuthEndpoints() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}")) // Posílá prázdné tělo
                .andExpect(status().is4xxClientError()) // Čeká 400 Bad Request (validace), ale NE 401/403
                .andExpect(status().is(400)); // Konkrétně 400, ne 403 Forbidden
    }
    // --- 2. TESTY CHRÁNĚNÝCH ENDPOINTŮ (PROTECTED) ---
    @Test
    @DisplayName("Nepřihlášený uživatel nesmí přistupovat na obecné chráněné endpointy")
    void shouldDenyAnonymousAccessToProtectedResource() throws Exception {
        // Testuje .anyRequest().authenticated()
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().is(401));
    }
}
