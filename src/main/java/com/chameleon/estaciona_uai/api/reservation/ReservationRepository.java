package com.chameleon.estaciona_uai.api.reservation;

import com.chameleon.estaciona_uai.domain.reservation.Reservation;
import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpace;
import com.chameleon.estaciona_uai.domain.user.Customer;
import com.chameleon.estaciona_uai.domain.reservation.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    List<Reservation> findByCustomer(Customer customer);

    @Query("SELECT r FROM Reservation r " +
           "WHERE r.parkingSpace = :parkingSpace " +
           "AND r.startAt < :endAt " +
           "AND r.endAt > :startAt " +
           "AND r.status IN :statuses")
    List<Reservation> findConflictingReservations(
            @Param("parkingSpace") ParkingSpace parkingSpace,
            @Param("startAt") LocalDateTime startAt,
            @Param("endAt") LocalDateTime endAt,
            @Param("statuses") List<ReservationStatus> statuses);

    List<Reservation> findByParkingSpaceAndStatusIn(ParkingSpace parkingSpace, List<ReservationStatus> statuses);

    List<Reservation> findByStatusAndEndAtBefore(ReservationStatus status, LocalDateTime dateTime);
}