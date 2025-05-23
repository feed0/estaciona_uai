package com.chameleon.estaciona_uai.api.user.admin;

import com.chameleon.estaciona_uai.api.user.admin.dto.AdminManagesParkingSpaceResponse;
import com.chameleon.estaciona_uai.api.user.admin.dto.AdminManagesParkingSpaceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/{adminId}")
public class AdminController {

    private final AdminService service;

    @PostMapping("/parking-space")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminManagesParkingSpaceResponse createParkingSpace(@PathVariable UUID adminId,
                                                   @RequestBody AdminManagesParkingSpaceRequest adminManagesParkingSpaceRequest) {
        return service.createParkingSpace(adminId, adminManagesParkingSpaceRequest);
    }

    @GetMapping("/parking-space")
    public java.util.List<AdminManagesParkingSpaceResponse> getParkingSpaces(@PathVariable UUID adminId) {
        return service.getParkingSpaces(adminId);
    }

    @PatchMapping("/parking-space/{parkingSpaceId}")
    public AdminManagesParkingSpaceResponse updateParkingSpace(@PathVariable UUID adminId,
                                                   @PathVariable UUID parkingSpaceId,
                                                   @RequestBody AdminManagesParkingSpaceRequest adminManagesParkingSpaceRequest) {
        return service.updateParkingSpace(adminId, parkingSpaceId, adminManagesParkingSpaceRequest);
    }

    @DeleteMapping("/parking-space/{parkingSpaceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteParkingSpace(@PathVariable UUID adminId,
                       @PathVariable UUID parkingSpaceId) {
        service.deleteParkingSpace(adminId, parkingSpaceId);
    }
}