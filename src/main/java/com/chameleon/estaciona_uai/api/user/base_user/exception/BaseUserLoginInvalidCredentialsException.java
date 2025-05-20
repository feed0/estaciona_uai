package com.chameleon.estaciona_uai.api.user.base_user.exception;

public class BaseUserLoginInvalidCredentialsException extends RuntimeException {
    public BaseUserLoginInvalidCredentialsException(String email) {
        super("User login attempt with invalid credentials for email '" + email + "'");
    }
}