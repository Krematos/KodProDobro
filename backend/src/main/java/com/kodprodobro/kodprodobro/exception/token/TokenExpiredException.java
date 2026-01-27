package com.kodprodobro.kodprodobro.exception.token;

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String token) {
        super("Reset token vypršel: " + token);
    }
}
