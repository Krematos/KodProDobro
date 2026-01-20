package com.kodprodobro.kodprodobro.exception;

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String token) {
        super("Reset token vypršel: " + token);
    }
}
