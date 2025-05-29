package com.chameleon.estaciona_uai.api.parking.parking_space;

import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpace;
import com.chameleon.estaciona_uai.domain.user.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingSpaceRepository extends JpaRepository<ParkingSpace, UUID> {

    @Query("""
           SELECT ps
           FROM ParkingSpace ps
           WHERE ps.id = :id
             AND ps.parking.manager = :manager
             AND ps.deletedAt IS NULL
           """)
    Optional<ParkingSpace> findActiveByIdAndManager(@Param("id") UUID id,
                                                    @Param("manager") Manager manager);

    @Query("""
           SELECT ps
           FROM ParkingSpace ps
           WHERE ps.parking.manager = :manager
             AND ps.deletedAt IS NULL
           """)
    List<ParkingSpace> findActiveByManager(@Param("manager") Manager manager);

        // ...existing code...
    List<ParkingSpace> findByParkingAndDeletedAtIsNull(Parking parking);

    @Query("SELECT ps FROM ParkingSpace ps JOIN FETCH ps.parking WHERE ps.id = :id AND ps.deletedAt IS NULL")
    Optional<ParkingSpace> findByIdAndFetchParking(@Param("id") UUID id);

    // If you need a method to find active spaces by manager for other purposes:
    // List<ParkingSpace> findActiveByManager(Manager manager);
}