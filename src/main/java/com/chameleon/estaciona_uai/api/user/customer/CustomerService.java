package com.chameleon.estaciona_uai.api.user.customer;

import com.chameleon.estaciona_uai.api.parking.ParkingRepository;
import com.chameleon.estaciona_uai.api.parking.parking_space.ParkingSpaceRepository;
import com.chameleon.estaciona_uai.api.reservation.ReservationRepository;
import com.chameleon.estaciona_uai.api.user.customer.dto.request.CustomerCreateReservationRequest;
import com.chameleon.estaciona_uai.api.user.customer.dto.request.CustomerSignupRequest;
import com.chameleon.estaciona_uai.api.user.customer.dto.response.CustomerParkingDetailResponse;
import com.chameleon.estaciona_uai.api.user.customer.dto.response.CustomerParkingSummaryResponse;
import com.chameleon.estaciona_uai.api.user.customer.dto.response.CustomerReservationResponse;
import com.chameleon.estaciona_uai.api.user.customer.dto.response.CustomerResponse;
import com.chameleon.estaciona_uai.domain.parking.Parking;
import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpace;
import com.chameleon.estaciona_uai.domain.parking.parking_space.ParkingSpaceStatus;
import com.chameleon.estaciona_uai.domain.reservation.Reservation;
import com.chameleon.estaciona_uai.domain.reservation.ReservationStatus;
import com.chameleon.estaciona_uai.domain.user.Customer;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ReservationRepository reservationRepository;
    private final ParkingSpaceRepository parkingSpaceRepository;
    private final ParkingRepository parkingRepository;

    public void signup(CustomerSignupRequest customerSignupRequest) {
        Customer customer = new Customer();
        customer.setName(customerSignupRequest.getName());
        customer.setEmail(customerSignupRequest.getEmail());
        customer.setPassword(customerSignupRequest.getPassword());

        customerRepository.save(customer);

        System.out.println("Customer signed up: " + customerSignupRequest);
    }

        // == Reservation Management ==

    public CustomerReservationResponse createReservation(UUID customerId, CustomerCreateReservationRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + customerId));

        ParkingSpace parkingSpace = parkingSpaceRepository.findById(request.getParkingSpaceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking space not found with ID: " + request.getParkingSpaceId()));

        // Use current time as the start time
        LocalDateTime startAt = LocalDateTime.now();

        if (startAt.isAfter(request.getEndAt()) || startAt.isEqual(request.getEndAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after the current time");
        }

        ParkingSpace freshParkingSpace = parkingSpaceRepository.findByIdAndFetchParking(parkingSpace.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking space disappeared"));
        if (freshParkingSpace.getVersion() != parkingSpace.getVersion()) {
            throw new OptimisticLockException("Parking space was updated by another transaction. Please try again.");
        }
        freshParkingSpace.assertFree();

        Parking parking = freshParkingSpace.getParking();
        if (parking.getOpenAt() != null && parking.getCloseAt() != null) {
            boolean is24Hour = parking.getOpenAt().equals(parking.getCloseAt());
            if (!is24Hour) {
                if (startAt.toLocalTime().isBefore(parking.getOpenAt()) ||
                        request.getEndAt().toLocalTime().isAfter(parking.getCloseAt()) ||
                        (startAt.toLocalDate().isBefore(request.getEndAt().toLocalDate()) && !request.getEndAt().toLocalTime().equals(parking.getCloseAt()))) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation time is outside parking operating hours: " + parking.getOpenAt() + " - " + parking.getCloseAt());
                }
            }
        }

        // Update to only use CONFIRMED status since ACTIVE is removed
        List<ReservationStatus> conflictingStatuses = Arrays.asList(ReservationStatus.CONFIRMED);
        List<Reservation> conflictingReservations = reservationRepository.findConflictingReservations(
                freshParkingSpace, startAt, request.getEndAt(), conflictingStatuses);

        if (!conflictingReservations.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Parking space is already reserved for the selected time slot.");
        }

        Reservation reservation = new Reservation();
        reservation.setCustomer(customer);
        reservation.setParkingSpace(freshParkingSpace);
        reservation.setStartAt(startAt);
        reservation.setEndAt(request.getEndAt());
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        freshParkingSpace.setStatus(ParkingSpaceStatus.RESERVED);
        parkingSpaceRepository.save(freshParkingSpace);

        Reservation savedReservation = reservationRepository.save(reservation);
        return CustomerReservationResponse.fromEntity(savedReservation);
    }

    @Transactional()
    public List<CustomerReservationResponse> getReservationsByCustomerId(UUID customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        return reservationRepository.findByCustomer(customer).stream()
                .map(CustomerReservationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelReservation(UUID customerId, UUID reservationId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));

        if (!reservation.getCustomer().getId().equals(customer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Customer not authorized to cancel this reservation");
        }

        if (reservation.getStatus() == ReservationStatus.COMPLETED || reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation is already " + reservation.getStatus().toString().toLowerCase() + " and cannot be cancelled.");
        }

        // Remove this check since ACTIVE status no longer exists
        // if (reservation.getStatus() == ReservationStatus.ACTIVE) {
        //    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot cancel an active reservation. Please contact support.");
        // }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancelledAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        ParkingSpace parkingSpace = reservation.getParkingSpace();
        // Update to only use CONFIRMED status
        List<ReservationStatus> activeStatuses = Arrays.asList(ReservationStatus.CONFIRMED);
        List<Reservation> otherReservations = reservationRepository.findByParkingSpaceAndStatusIn(parkingSpace, activeStatuses);

        if (otherReservations.stream().noneMatch(r -> !r.getId().equals(reservationId))) {
            ParkingSpace freshParkingSpace = parkingSpaceRepository.findById(parkingSpace.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Parking space disappeared during cancellation"));
            if (freshParkingSpace.getStatus() == ParkingSpaceStatus.RESERVED) {
                freshParkingSpace.setStatus(ParkingSpaceStatus.FREE);
                parkingSpaceRepository.save(freshParkingSpace);
            }
        }
    }

    // == Parking Listing ==
    @Transactional()
    public List<CustomerParkingSummaryResponse> getAllParkingsForCustomer() {
        return parkingRepository.findAllByDeletedAtIsNull().stream() // Assuming a soft delete mechanism
                .map(CustomerParkingSummaryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional()
    public CustomerParkingDetailResponse getParkingDetailsForCustomer(UUID parkingId) {
        Parking parking = parkingRepository.findByIdAndDeletedAtIsNull(parkingId) // Assuming soft delete
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking not found"));

        // Fetch active (non-deleted) parking spaces for this parking
        List<ParkingSpace> activeSpaces = parkingSpaceRepository.findByParkingAndDeletedAtIsNull(parking);

        return CustomerParkingDetailResponse.fromEntity(parking, activeSpaces);
    }

    @Transactional
    public CustomerResponse getCustomerById(UUID customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Customer not found with ID: " + customerId));

        return CustomerResponse.fromEntity(customer);
    }
}