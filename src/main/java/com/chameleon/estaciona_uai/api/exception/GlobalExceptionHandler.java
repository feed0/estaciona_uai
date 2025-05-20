package com.chameleon.estaciona_uai.api.exception;

import jakarta.persistence.OptimisticLockException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<?> forbidden(SecurityException ex) {
        return error(HttpStatus.FORBIDDEN, "This ParkingSpace does not belong to your Manager's Parking");
    }

    @ExceptionHandler({IllegalStateException.class, OptimisticLockException.class})
    public ResponseEntity<?> conflict(RuntimeException ex) {
        return error(HttpStatus.CONFLICT, "This ParkingSpace's status isn't free, try again when it is free");
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String detail) {
        return ResponseEntity.status(status).body(
            Map.of("status", status.value(), "detail", detail)
        );
    }
}