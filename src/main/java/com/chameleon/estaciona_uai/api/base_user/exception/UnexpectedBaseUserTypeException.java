package com.chameleon.estaciona_uai.api.base_user.exception;

public class UnexpectedBaseUserTypeException extends RuntimeException {
    public UnexpectedBaseUserTypeException(String email) {
        super("Unexpected UserType for email '" + email + "'.");
    }
}
