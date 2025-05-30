package com.chameleon.estaciona_uai.api.reservation;

import com.chameleon.estaciona_uai.api.parking.parking_space.ParkingSpaceRepository;
import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpace;
import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpaceStatus;
import com.chameleon.estaciona_uai.domain.reservation.Reservation;
import com.chameleon.estaciona_uai.domain.reservation.ReservationStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@EnableScheduling
@Slf4j
public class ReservationCompletionService {

    private final ReservationRepository reservationRepository;
    private final ParkingSpaceRepository parkingSpaceRepository;

    /**
     * Scheduled task that runs every 30 seconds to check for completed reservations
     * Updates the status of reservations where the current time has passed the endAt time
     */
    @Scheduled(fixedRate = 30000) // 30 seconds in milliseconds
    @Transactional
    public void checkForCompletedReservations() {
        log.info("Checking for completed reservations at {}", LocalDateTime.now());

        // Find all active reservations that have passed their endAt time
        List<Reservation> expiredReservations = reservationRepository.findByStatusAndEndAtBefore(
                ReservationStatus.CONFIRMED, LocalDateTime.now());

        if (!expiredReservations.isEmpty()) {
            log.info("Found {} expired reservations to complete", expiredReservations.size());

            for (Reservation reservation : expiredReservations) {
                completeReservation(reservation);
            }
        }
    }

    /**
     * Updates a reservation and its associated parking space as completed
     */
    private void completeReservation(Reservation reservation) {
        // Update reservation status
        reservation.setStatus(ReservationStatus.COMPLETED);
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        // Free up the parking space
        ParkingSpace parkingSpace = reservation.getParkingSpace();
        parkingSpace.setStatus(ParkingSpaceStatus.FREE);
        parkingSpaceRepository.save(parkingSpace);

        log.info("Completed reservation ID: {} for parking space: {}",
                reservation.getId(), parkingSpace.getIdentifier());
    }
}