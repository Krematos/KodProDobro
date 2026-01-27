package com.kodprodobro.kodprodobro.exception.email;

public class EmailServiceException extends RuntimeException {
    public EmailServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
