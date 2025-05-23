package com.chameleon.estaciona_uai.api.user.base_user.exception;

public class BaseUserNotFoundException extends RuntimeException {
    public BaseUserNotFoundException(String email) {
        super("User with email '" + email + "' not found.");
    }
}