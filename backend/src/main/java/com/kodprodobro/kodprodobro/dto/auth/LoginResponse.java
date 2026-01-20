package com.kodprodobro.kodprodobro.dto.auth;

import java.util.List;

public record LoginResponse(
        String token,
        String type,
        List<String> roles
) {}
