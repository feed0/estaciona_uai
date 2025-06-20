package com.chameleon.estaciona_uai.api.user.customer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CustomerCreateReservationRequest {
    // customerId will be taken from the path parameter in the controller
    // @NotNull
    // private UUID customerId;

    @NotNull
    private UUID parkingSpaceId;

//    @NotNull
//    @Future(message = "Start time must be in the future")
//    private LocalDateTime startAt;

    @NotNull
    private LocalDateTime endAt;
}