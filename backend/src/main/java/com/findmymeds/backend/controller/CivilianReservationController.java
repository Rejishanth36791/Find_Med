package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.Reservation;
import com.findmymeds.backend.service.CivilianReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.findmymeds.backend.config.CivilianUserDetails;
import com.findmymeds.backend.dto.ActivityResponse;
import com.findmymeds.backend.dto.ReservationDetailDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")

public class CivilianReservationController {

    @Autowired
    private CivilianReservationService reservationService;

    @PostMapping
    public Reservation createReservation(@RequestBody @org.springframework.lang.NonNull Reservation reservation) {
        return reservationService.createReservation(reservation);
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/civilian/{civilianId}")
    public List<Reservation> getReservationsByCivilian(
            @PathVariable @org.springframework.lang.NonNull Long civilianId) {
        return reservationService.getReservationsByCivilian(civilianId);
    }

    // New Endpoints for Reservation Flow

    @GetMapping("/medicines/search")
    public List<com.findmymeds.backend.model.Medicine> searchMedicines(@RequestParam String name) {
        return reservationService.searchMedicines(name);
    }

    @PostMapping("/recommend-pharmacies")
    public List<java.util.Map<String, Object>> recommendPharmacies(@RequestBody java.util.Map<String, Object> request) {
        Long medicineId = Long.valueOf(request.get("medicineId").toString());
        Integer quantity = Integer.valueOf(request.get("requiredQuantity").toString());

        Double userLat = request.containsKey("lat") ? Double.valueOf(request.get("lat").toString()) : null;
        Double userLng = request.containsKey("lng") ? Double.valueOf(request.get("lng").toString()) : null;

        return reservationService.recommendPharmacies(medicineId, quantity, userLat, userLng);
    }

    @PostMapping("/confirm")
    public Reservation confirmReservation(@RequestBody java.util.Map<String, Object> request) {
        // Extract data
        Long civilianId = Long.valueOf(request.get("civilianId").toString()); // Assuming passed for now
        // In real app, get from Security Context

        Long medicineId = Long.valueOf(request.get("medicineId").toString());
        Long pharmacyId = Long.valueOf(request.get("pharmacyId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        String pickupDateStr = (String) request.get("pickupDate");
        String notes = (String) request.get("notes");
        String prescriptionFile = (String) request.get("prescriptionFile");

        java.time.LocalDate pickupDate = java.time.LocalDate.parse(pickupDateStr);

        return reservationService.confirmReservation(
                java.util.Objects.requireNonNull(civilianId),
                java.util.Objects.requireNonNull(medicineId),
                java.util.Objects.requireNonNull(pharmacyId),
                quantity, pickupDate, notes,
                prescriptionFile);
    }

    @GetMapping("/activity")
    public ResponseEntity<ActivityResponse> getActivity(@AuthenticationPrincipal CivilianUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(reservationService.getActivity(userDetails.getCivilian().getId()));
    }

    @GetMapping("/{reservationId}/details")
    public ResponseEntity<ReservationDetailDTO> getReservationDetails(
            @PathVariable @org.springframework.lang.NonNull Long reservationId,
            @AuthenticationPrincipal CivilianUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity
                .ok(reservationService.getReservationDetails(
                        java.util.Objects.requireNonNull(reservationId),
                        java.util.Objects.requireNonNull(userDetails.getCivilian().getId())));
    }

    @PostMapping("/{reservationId}/cancel")
    public ResponseEntity<?> cancelReservation(
            @PathVariable @org.springframework.lang.NonNull Long reservationId,
            @AuthenticationPrincipal CivilianUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        reservationService.cancelReservation(java.util.Objects.requireNonNull(reservationId),
                java.util.Objects.requireNonNull(userDetails.getCivilian().getId()));
        return ResponseEntity.ok(Map.of("message", "Reservation cancelled successfully", "status", "CANCELLED"));
    }
}
