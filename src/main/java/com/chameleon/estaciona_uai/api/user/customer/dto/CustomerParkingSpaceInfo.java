package com.chameleon.estaciona_uai.api.user.customer.dto;

import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpace;
import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpaceStatus;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CustomerParkingSpaceInfo {
    private UUID id;
    private String identifier;
    private ParkingSpaceStatus status;
    // Add other relevant info like type (e.g., REGULAR, HANDICAP, ELECTRIC) if available

    public static CustomerParkingSpaceInfo fromEntity(ParkingSpace parkingSpace) {
        return CustomerParkingSpaceInfo.builder()
                .id(parkingSpace.getId())
                .identifier(parkingSpace.getIdentifier())
                .status(parkingSpace.getStatus())
                .build();
    }
}