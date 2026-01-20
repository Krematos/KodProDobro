package com.kodprodobro.kodprodobro.dto.security;

import java.util.Set;

public record TokenValidationResponse(boolean valid, String username, Set<String> role) {
}
