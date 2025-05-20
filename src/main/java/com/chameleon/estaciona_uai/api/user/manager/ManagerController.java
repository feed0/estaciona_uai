package com.chameleon.estaciona_uai.api.user.manager;

import com.chameleon.estaciona_uai.api.user.manager.dto.request.ManagerManagesAdminRequest;
import com.chameleon.estaciona_uai.api.user.manager.dto.request.ManagerSignupRequest;
import com.chameleon.estaciona_uai.api.user.manager.dto.response.ManagerManagesAdminResponse;
import com.chameleon.estaciona_uai.domain.user.Admin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String>signup(@RequestBody ManagerSignupRequest managerSignupRequest) {
        managerService.signup(managerSignupRequest);
        return new ResponseEntity<>("Manager signed up successfully", HttpStatus.CREATED);
    }

    @PostMapping("/{managerId}/admins")
    public ResponseEntity<ManagerManagesAdminResponse> createAdmin(
            @PathVariable UUID managerId,
            @RequestBody ManagerManagesAdminRequest adminDTO) {
        Admin admin = managerService.createAdmin(managerId, adminDTO);
        return ResponseEntity.ok(ManagerManagesAdminResponse.fromEntity(admin));
    }

    @GetMapping("/{managerId}/admins")
    public ResponseEntity<List<ManagerManagesAdminResponse>> getManagerAdmins(@PathVariable UUID managerId) {
        List<ManagerManagesAdminResponse> admins = managerService.getManagerAdmins(managerId)
                .stream()
                .map(ManagerManagesAdminResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(admins);
    }

    @PutMapping("/{managerId}/admins/{adminId}")
    public ResponseEntity<ManagerManagesAdminResponse> updateAdmin(
            @PathVariable UUID managerId,
            @PathVariable UUID adminId,
            @RequestBody ManagerManagesAdminRequest adminDTO) {
        Admin admin = managerService.updateAdmin(managerId, adminId, adminDTO);
        return ResponseEntity.ok(ManagerManagesAdminResponse.fromEntity(admin));
    }

    @DeleteMapping("/{managerId}/admins/{adminId}")
    public ResponseEntity<Void> deleteAdmin(
            @PathVariable UUID managerId,
            @PathVariable UUID adminId) {
        managerService.deleteAdmin(managerId, adminId);
        return ResponseEntity.noContent().build();
    }
}
