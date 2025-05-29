package com.chameleon.estaciona_uai.api.parking;

import com.chameleon.estaciona_uai.domain.parking.Parking;
import com.chameleon.estaciona_uai.domain.user.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingRepository extends JpaRepository<Parking, UUID> {
    Optional<Parking> findByManager(Manager manager);
    List<Parking> findAllByDeletedAtIsNull();
    Optional<Parking> findByIdAndDeletedAtIsNull(UUID id);
}