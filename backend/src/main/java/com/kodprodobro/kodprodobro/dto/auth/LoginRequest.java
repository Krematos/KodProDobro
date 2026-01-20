package com.kodprodobro.kodprodobro.dto.auth;

public record LoginRequest(
        String username,
        String password
) {
}
