package com.chameleon.estaciona_uai.api.user.customer;

import com.chameleon.estaciona_uai.api.user.customer.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody CustomerSignupRequest customerSignupRequest) {
        customerService.signup(customerSignupRequest);
        return new ResponseEntity<>("Customer signed up successfully", HttpStatus.CREATED);
    }

        // == Parkings Listing Endpoints ==
    @GetMapping("/parkings")
    public ResponseEntity<List<CustomerParkingSummaryResponse>> getAllParkings() {
        // Assuming this endpoint is for any authenticated customer to see all available parkings
        // No specific customerId needed in path if it's a general list
        List<CustomerParkingSummaryResponse> parkings = customerService.getAllParkingsForCustomer();
        return ResponseEntity.ok(parkings);
    }

    @GetMapping("/parkings/{parkingId}/spaces")
    public ResponseEntity<CustomerParkingDetailResponse> getParkingSpaces(
            @PathVariable UUID parkingId) {
        // No specific customerId needed in path if it's general parking details
        CustomerParkingDetailResponse parkingDetail = customerService.getParkingDetailsForCustomer(parkingId);
        return ResponseEntity.ok(parkingDetail);
    }

    // == Reservation Endpoints ==
    // Path: /api/customer/{customerId}/dashboard/parking/{parkingId}/page.tsx (Frontend)
    // POST “/api/customer/...” Reservation on selected ParkingSpaces
    // The frontend path suggests customerId and parkingId are known.
    // We can make the API reflect this or keep it more generic.
    // For creating a reservation, the customerId is crucial.

    @PostMapping("/{customerId}/reservations")
    public ResponseEntity<CustomerReservationResponse> createReservation(
            @PathVariable UUID customerId,
            @Valid @RequestBody CustomerCreateReservationRequest request) {
        CustomerReservationResponse response = customerService.createReservation(customerId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // GET “/api/customer/...” Reservations by userID
    @GetMapping("/{customerId}/reservations")
    public ResponseEntity<List<CustomerReservationResponse>> getMyReservations(@PathVariable UUID customerId) {
        List<CustomerReservationResponse> responses = customerService.getReservationsByCustomerId(customerId);
        return ResponseEntity.ok(responses);
    }

    // SOFT DELETE “/api/customer/...” selected Reservation
    // The user story implies a soft delete. Let's call it "cancel".
    @PatchMapping("/{customerId}/reservations/{reservationId}/cancel")
    public ResponseEntity<Void> cancelReservation(
            @PathVariable UUID customerId,
            @PathVariable UUID reservationId) {
        customerService.cancelReservation(customerId, reservationId);
        return ResponseEntity.noContent().build();
    }
}