package com.chameleon.estaciona_uai.api.user.customer;

import com.chameleon.estaciona_uai.api.user.customer.dto.CustomerSignupRequest;
import com.chameleon.estaciona_uai.domain.user.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    @Transactional
    public CustomerReservationResponse createReservation(UUID customerId, CustomerCreateReservationRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + customerId));

        ParkingSpace parkingSpace = parkingSpaceRepository.findById(request.getParkingSpaceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking space not found with ID: " + request.getParkingSpaceId()));

        if (request.getStartAt().isAfter(request.getEndAt()) || request.getStartAt().isEqual(request.getEndAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }
        if (request.getStartAt().isBefore(LocalDateTime.now())) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time cannot be in the past");
        }


        ParkingSpace freshParkingSpace = parkingSpaceRepository.findByIdAndFetchParking(parkingSpace.getId()) // Assumes a method to fetch parking eagerly or join
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking space disappeared"));
        if (freshParkingSpace.getVersion() != parkingSpace.getVersion()) { // Compare with initially fetched version if needed, or rely on DB versioning
            throw new OptimisticLockException("Parking space was updated by another transaction. Please try again.");
        }
        freshParkingSpace.assertFree(); // This should check current status

        Parking parking = freshParkingSpace.getParking();
        if (parking.getOpenAt() != null && parking.getCloseAt() != null) {
            // Check if parking is 24h
            boolean is24Hour = parking.getOpenAt().equals(parking.getCloseAt());
            if (!is24Hour) {
                if (request.getStartAt().toLocalTime().isBefore(parking.getOpenAt()) ||
                    request.getEndAt().toLocalTime().isAfter(parking.getCloseAt()) ||
                    // Case where reservation spans across midnight, but parking is not 24h
                    (request.getStartAt().toLocalDate().isBefore(request.getEndAt().toLocalDate()) &&
                     !request.getEndAt().toLocalTime().equals(parking.getCloseAt()) ) ) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation time is outside parking operating hours: " + parking.getOpenAt() + " - " + parking.getCloseAt());
                }
            }
        }


        List<ReservationStatus> conflictingStatuses = Arrays.asList(ReservationStatus.CONFIRMED, ReservationStatus.ACTIVE);
        List<Reservation> conflictingReservations = reservationRepository.findConflictingReservations(
                freshParkingSpace, request.getStartAt(), request.getEndAt(), conflictingStatuses);

        if (!conflictingReservations.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Parking space is already reserved for the selected time slot.");
        }

        Reservation reservation = new Reservation();
        reservation.setCustomer(customer);
        reservation.setParkingSpace(freshParkingSpace);
        reservation.setStartAt(request.getStartAt());
        reservation.setEndAt(request.getEndAt());
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        freshParkingSpace.setStatus(ParkingSpaceStatus.RESERVED);
        parkingSpaceRepository.save(freshParkingSpace);

        Reservation savedReservation = reservationRepository.save(reservation);
        return CustomerReservationResponse.fromEntity(savedReservation);
    }

    @Transactional(readOnly = true)
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
        if (reservation.getStatus() == ReservationStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot cancel an active reservation. Please contact support.");
        }
        // Optional: Add rule: Cannot cancel if startAt is within X hours from now.
        // if (reservation.getStartAt().isBefore(LocalDateTime.now().plusHours(1))) { // Example: 1 hour notice
        //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation cannot be cancelled as it starts too soon.");
        // }


        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        ParkingSpace parkingSpace = reservation.getParkingSpace();
        // Check if other active/confirmed reservations exist for this space for the *same time slot or future*
        // This logic might be complex. For now, if we cancel, we check if ANY other reservation makes it reserved.
        List<ReservationStatus> activeStatuses = Arrays.asList(ReservationStatus.CONFIRMED, ReservationStatus.ACTIVE);
        List<Reservation> otherReservations = reservationRepository.findByParkingSpaceAndStatusIn(parkingSpace, activeStatuses);

        // If no other CONFIRMED or ACTIVE reservations for this space, set it to FREE
        // This needs to be careful about concurrent updates.
        if (otherReservations.stream().noneMatch(r -> !r.getId().equals(reservationId))) {
            ParkingSpace freshParkingSpace = parkingSpaceRepository.findById(parkingSpace.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Parking space disappeared during cancellation"));
            // Only set to FREE if its current status is RESERVED. It might be OCCUPIED by a non-reserved car.
            if (freshParkingSpace.getStatus() == ParkingSpaceStatus.RESERVED) {
                 freshParkingSpace.setStatus(ParkingSpaceStatus.FREE);
                 parkingSpaceRepository.save(freshParkingSpace);
            }
        }
    }

    // == Parking Listing ==
    @Transactional(readOnly = true)
    public List<CustomerParkingSummaryResponse> getAllParkingsForCustomer() {
        return parkingRepository.findAllByDeletedAtIsNull().stream() // Assuming a soft delete mechanism
                .map(CustomerParkingSummaryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerParkingDetailResponse getParkingDetailsForCustomer(UUID parkingId) {
        Parking parking = parkingRepository.findByIdAndDeletedAtIsNull(parkingId) // Assuming soft delete
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking not found"));

        // Fetch active (non-deleted) parking spaces for this parking
        List<ParkingSpace> activeSpaces = parkingSpaceRepository.findByParkingAndDeletedAtIsNull(parking);

        return CustomerParkingDetailResponse.fromEntity(parking, activeSpaces);
    }
}