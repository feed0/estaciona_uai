package com.chameleon.estaciona_uai.api.user.admin;

import com.chameleon.estaciona_uai.api.parking.ParkingRepository;
import com.chameleon.estaciona_uai.api.parking.parking_space.ParkingSpaceRepository;
import com.chameleon.estaciona_uai.api.user.admin.dto.AdminManagesParkingSpaceRequest;
import com.chameleon.estaciona_uai.api.user.admin.dto.AdminManagesParkingSpaceResponse;
import com.chameleon.estaciona_uai.domain.parking.Parking;
import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpace;
import com.chameleon.estaciona_uai.domain.user.Admin;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final ParkingRepository parkingRepository;
    private final ParkingSpaceRepository parkingSpaceRepository;

    @Transactional
    public AdminManagesParkingSpaceResponse createParkingSpace(UUID adminId, AdminManagesParkingSpaceRequest adminManagesParkingSpaceRequest) {

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new SecurityException("NOT_FOUND_ADMIN"));

        Parking parking = parkingRepository.findByManager(admin.getManager())
                .orElseThrow(() -> new SecurityException("NOT_OWNER_PARKING"));

        ParkingSpace parkingSpace = new ParkingSpace();
        parkingSpace.setParking(parking);
        parkingSpace.setIdentifier(adminManagesParkingSpaceRequest.getIdentifier());

        parkingSpaceRepository.save(parkingSpace);
        return toResponse(parkingSpace);
    }

    @Transactional
    public java.util.List<AdminManagesParkingSpaceResponse> getParkingSpaces(UUID adminId) {

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new SecurityException("NOT_FOUND_ADMIN"));

        return parkingSpaceRepository.findActiveByManager(admin.getManager())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminManagesParkingSpaceResponse updateParkingSpace(UUID adminId, UUID spaceId, AdminManagesParkingSpaceRequest body) {

        Admin admin = adminRepository.findById(adminId)
                                     .orElseThrow(() -> new SecurityException("NOT_FOUND_ADMIN"));

        ParkingSpace parkingSpace = parkingSpaceRepository
                .findActiveByIdAndManager(spaceId, admin.getManager())
                .orElseThrow(() -> new SecurityException("NOT_OWNER"));

        parkingSpace.validateOwnership(admin);
        parkingSpace.assertFree();

        parkingSpace.setIdentifier(body.getIdentifier());

        return toResponse(parkingSpace);
    }

    @Transactional
    public void deleteParkingSpace(UUID adminId, UUID spaceId) {

        Admin admin = adminRepository.findById(adminId)
                                     .orElseThrow(() -> new SecurityException("NOT_FOUND_ADMIN"));

        ParkingSpace parkingSpace = parkingSpaceRepository
                .findActiveByIdAndManager(spaceId, admin.getManager())
                .orElseThrow(() -> new SecurityException("NOT_OWNER"));

        parkingSpace.validateOwnership(admin);
        parkingSpace.assertFree();
        parkingSpace.softDelete();
    }

    private AdminManagesParkingSpaceResponse toResponse(ParkingSpace parkingSpace) {
        return AdminManagesParkingSpaceResponse.builder()
                .id(parkingSpace.getId())
                .identifier(parkingSpace.getIdentifier())
                .status(parkingSpace.getStatus())
                .deletedAt(parkingSpace.getDeletedAt())
                .version(parkingSpace.getVersion())
                .build();
    }
}