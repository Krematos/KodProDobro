package com.kodprodobro.kodprodobro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {

    @NotBlank(message = "Uživatelské jméno nesmí být prázdné")
    @Size(min = 3, max = 20, message = "Uživatelské jméno musí mít mezi 3 a 20 znaky")
    private String username;

    @NotBlank(message = "Email nesmí být prázdný")
    @Size(max = 50, message = "Email nesmí překročit 50 znaků")
    @Email(message = "Neplatný formát emailu")
    private String email;

    @NotBlank(message = "Heslo nesmí být prázdné")
    @Size(min = 6, max = 40, message = "Heslo musí mít mezi 6 a 40 znaky")
    private String password;


    private Set<String> roles;
}
