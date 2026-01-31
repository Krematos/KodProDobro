package com.kodprodobro.kodprodobro.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Uživatelské jméno nesmí být prázdné")
        @Size(min = 3, max = 50, message = "Uživatelské jméno musí mít mezi 3 a 50 znaky")
        String username,
        @NotBlank(message = "Heslo nesmí být prázdné")
        @Size(min = 8, max = 100, message = "Heslo musí mít mezi 8 a 100 znaky")
        String password
) {
}
