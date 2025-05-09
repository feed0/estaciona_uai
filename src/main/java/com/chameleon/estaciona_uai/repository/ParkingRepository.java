package com.chameleon.estaciona_uai.repository;

import com.chameleon.estaciona_uai.domain.parking.Parking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ParkingRepository extends JpaRepository<Parking, UUID> {
}
