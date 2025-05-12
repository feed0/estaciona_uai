package com.chameleon.estaciona_uai.api.manager;

import com.chameleon.estaciona_uai.domain.parking.Parking;
import com.chameleon.estaciona_uai.domain.user.Manager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerRepository managerRepository;

    public void signup(ManagerSignupDto managerSignupDto) {
        // Manager
        Manager manager = new Manager();
        manager.setName(managerSignupDto.getName());
        manager.setEmail(managerSignupDto.getEmail());
        manager.setPassword(managerSignupDto.getPassword());

        // Parking
        Parking parking = new Parking();
        parking.setName(managerSignupDto.getParkingName());
        parking.setAddress(managerSignupDto.getParkingAddress());

        // Relationship
        parking.setManager(manager);
        manager.setParking(parking);

        managerRepository.save(manager);

        System.out.println("Manager signed up: " + managerSignupDto);
    }
}
