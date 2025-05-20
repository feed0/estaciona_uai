package com.chameleon.estaciona_uai.api.user.manager;

import com.chameleon.estaciona_uai.api.user.admin.AdminRepository;
import com.chameleon.estaciona_uai.api.user.manager.dto.request.ManagerManagesAdminRequest;
import com.chameleon.estaciona_uai.api.user.manager.dto.request.ManagerSignupRequest;
import com.chameleon.estaciona_uai.domain.parking.Parking;
import com.chameleon.estaciona_uai.domain.user.Admin;
import com.chameleon.estaciona_uai.domain.user.Manager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerRepository managerRepository;
    private final AdminRepository adminRepository;

    public void signup(ManagerSignupRequest managerSignupRequest) {
        // Manager
        Manager manager = new Manager();
        manager.setName(managerSignupRequest.getName());
        manager.setEmail(managerSignupRequest.getEmail());
        manager.setPassword(managerSignupRequest.getPassword());

        // Parking
        Parking parking = new Parking();
        parking.setName(managerSignupRequest.getParkingName());
        parking.setAddress(managerSignupRequest.getParkingAddress());

        // Relationship
        parking.setManager(manager);
        manager.setParking(parking);

        managerRepository.save(manager);

        System.out.println("Manager signed up: " + managerSignupRequest);
    }

    public Admin createAdmin(UUID managerId, ManagerManagesAdminRequest adminDTO) {
        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manager not found."));

        Optional<Admin> optionalAdmin = adminRepository.findByEmail(adminDTO.getEmail());
        if (optionalAdmin.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Admin with this email already exists.");
        }

        Admin admin = new Admin();
        admin.setName(adminDTO.getName());
        admin.setEmail(adminDTO.getEmail());
        admin.setPassword(adminDTO.getPassword());
        admin.setManager(manager);

        return adminRepository.save(admin);
    }

    public List<Admin> getManagerAdmins(UUID managerId) {
        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manager not found."));
        return adminRepository.findAllByManager(manager);
    }

    public Admin updateAdmin(UUID managerId, UUID adminId, ManagerManagesAdminRequest adminDTO) {
        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manager not found."));

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found."));

        if (!admin.getManager().equals(manager)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This admin doesn't belong to this manager.");
        }

        admin.setName(adminDTO.getName());
        admin.setEmail(adminDTO.getEmail());
        if (adminDTO.getPassword() != null && !adminDTO.getPassword().isEmpty()) {
            admin.setPassword(adminDTO.getPassword());
        }

        return adminRepository.save(admin);
    }

    public void deleteAdmin(UUID managerId, UUID adminId) {
        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manager not found."));

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found."));

        if (!admin.getManager().equals(manager)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This admin doesn't belong to this manager.");
        }

        adminRepository.delete(admin);
    }
}
