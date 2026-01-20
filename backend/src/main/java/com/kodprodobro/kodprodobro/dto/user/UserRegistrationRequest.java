package com.kodprodobro.kodprodobro.dto.user;

public record UserRegistrationRequest(
        String username,
        String email,
        String password
) {
}
