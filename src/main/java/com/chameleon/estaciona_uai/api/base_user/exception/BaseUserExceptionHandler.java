package com.chameleon.estaciona_uai.api.base_user.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class BaseUserExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(BaseUserExceptionHandler.class);

    @ExceptionHandler(BaseUserNotFoundException.class)
    public ResponseEntity<String> handleBaseUserNotFoundException(BaseUserNotFoundException ex) {
        logger.warn("User not found during login attempt: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
    }

    @ExceptionHandler(BaseUserLoginInvalidCredentialsException.class)
    public ResponseEntity<String> handleBaseUserLoginInvalidCredentialsException(BaseUserLoginInvalidCredentialsException ex) {
        logger.warn("Invalid credentials during login attempt: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
    }

    @ExceptionHandler(UnexpectedBaseUserTypeException.class)
    public ResponseEntity<String> handleUnexpectedBaseUserTypeException(UnexpectedBaseUserTypeException ex) {
        logger.error("Unexpected user type encountered: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred.");
    }
}