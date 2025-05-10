package com.chameleon.estaciona_uai.service;

import com.chameleon.estaciona_uai.domain.parking.Parking;
import com.chameleon.estaciona_uai.domain.user.Manager;
import com.chameleon.estaciona_uai.dto.ManagerSignupDto;
import com.chameleon.estaciona_uai.repository.ManagerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerRepository managerRepository;

    public void signup(ManagerSignupDto managerSignupDto) {
        // Manager
        Manager manager = new Manager();
        manager.setName(managerSignupDto.getUserName());
        manager.setEmail(managerSignupDto.getUserEmail());
        manager.setPassword(managerSignupDto.getUserPassword());

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
