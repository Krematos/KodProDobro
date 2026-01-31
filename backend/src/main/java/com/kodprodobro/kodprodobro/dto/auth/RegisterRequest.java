package com.kodprodobro.kodprodobro.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        @Size(min = 3, max = 30, message = "Jméno musí mít 3-30 znaků")
        String username,
        @NotBlank @Email(message = "Email musí být platný")
        @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+\\..+)$", message = "Email musí obsahovat platnou doménu (např. .com, .cz)")
        String email,
        @NotBlank @Size(min= 8, max = 100, message = "Heslo musí mít alespoň 8 znaků")
        String password) {
}
