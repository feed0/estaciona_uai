package com.chameleon.estaciona_uai.api.user.customer.dto;

import com.chameleon.estaciona_uai.domain.reservation.Reservation;
import com.chameleon.estaciona_uai.domain.reservation.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CustomerReservationResponse {
    private UUID id;
    private UUID customerId;
    private UUID parkingSpaceId;
    private String parkingSpaceIdentifier; // e.g., "A01"
    private String parkingName; // Name of the parking facility
    private ReservationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime startAt;
    private LocalDateTime endAt;

    public static CustomerReservationResponse fromEntity(Reservation reservation) {
        return CustomerReservationResponse.builder()
                .id(reservation.getId())
                .customerId(reservation.getCustomer().getId())
                .parkingSpaceId(reservation.getParkingSpace().getId())
                .parkingSpaceIdentifier(reservation.getParkingSpace().getIdentifier())
                .parkingName(reservation.getParkingSpace().getParking().getName())
                .status(reservation.getStatus())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .startAt(reservation.getStartAt())
                .endAt(reservation.getEndAt())
                .build();
    }
}