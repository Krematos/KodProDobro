package com.kodprodobro.kodprodobro.dto.user;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserProfileRequest(
        @NotBlank(message = "Křestní jméno nesmí být prázdné")
        @Size(min = 2, max = 50, message = "Křestní jméno musí mít od 2 do 50 znaků")
        String firstName,

        @NotBlank(message = "Příjmení nesmí být prázdné")
        @Size(min = 2, max = 50, message = "Příjmení musí mít od 2 do 50 znaků")
        String lastName,
        String bio,
        String location,
        String websiteUrl
) {
}
