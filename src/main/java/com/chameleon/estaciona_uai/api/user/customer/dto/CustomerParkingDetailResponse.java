package com.chameleon.estaciona_uai.api.user.customer.dto;

import com.chameleon.estaciona_uai.domain.parking.Parking;
import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpace;
import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class CustomerParkingDetailResponse {
    private UUID id;
    private String name;
    private String address;
    private LocalTime openAt;
    private LocalTime closeAt;
    private List<CustomerParkingSpaceInfo> parkingSpaces;

    public static CustomerParkingDetailResponse fromEntity(Parking parking, List<ParkingSpace> spaces) {
        return CustomerParkingDetailResponse.builder()
                .id(parking.getId())
                .name(parking.getName())
                .address(parking.getAddress())
                .openAt(parking.getOpenAt())
                .closeAt(parking.getCloseAt())
                .parkingSpaces(spaces.stream()
                                     .filter(ps -> ps.getDeletedAt() == null) // Ensure only non-deleted spaces
                                     .map(CustomerParkingSpaceInfo::fromEntity)
                                     .collect(Collectors.toList()))
                .build();
    }
}