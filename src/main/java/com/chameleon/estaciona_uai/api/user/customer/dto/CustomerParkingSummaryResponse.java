package com.chameleon.estaciona_uai.api.user.customer.dto;

import com.chameleon.estaciona_uai.domain.parking.Parking;
import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class CustomerParkingSummaryResponse {
    private UUID id;
    private String name;
    private String address;
    private LocalTime openAt;
    private LocalTime closeAt;
    // Potentially add number of available spaces if easily calculable or frequently needed

    public static CustomerParkingSummaryResponse fromEntity(Parking parking) {
        return CustomerParkingSummaryResponse.builder()
                .id(parking.getId())
                .name(parking.getName())
                .address(parking.getAddress())
                .openAt(parking.getOpenAt())
                .closeAt(parking.getCloseAt())
                .build();
    }
}