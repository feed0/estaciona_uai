package com.chameleon.estaciona_uai.api.user.admin.dto;

import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpaceStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminManagesParkingSpaceResponse {
    private UUID id;
    private String identifier;
    private ParkingSpaceStatus status;
    private LocalDateTime deletedAt;
    private long version;
    private String parkingName;
}
