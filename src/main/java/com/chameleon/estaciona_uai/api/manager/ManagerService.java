package com.chameleon.estaciona_uai.api.manager;

import com.chameleon.estaciona_uai.api.manager.dto.ManagerSignupRequest;
import com.chameleon.estaciona_uai.domain.parking.Parking;
import com.chameleon.estaciona_uai.domain.user.Manager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerRepository managerRepository;

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
}
