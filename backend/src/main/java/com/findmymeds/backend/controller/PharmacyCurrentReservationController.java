package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.ReservationDTO;
import com.findmymeds.backend.service.PharmacyCurrentReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.findmymeds.backend.config.PharmacyUserDetails;
import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/reservations/current")
public class PharmacyCurrentReservationController {

    @Autowired
    private PharmacyCurrentReservationService reservationService;

    private Long getCurrentPharmacyId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof PharmacyUserDetails) {
            return ((PharmacyUserDetails) auth.getPrincipal()).getPharmacy().getId();
        }
        throw new RuntimeException("Unauthorized: User is not a pharmacy");
    }

    @GetMapping("/counts")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<List<Long>> getCurrentReservationCounts() {
        return ResponseEntity.ok(reservationService.getCurrentReservationCounts(getCurrentPharmacyId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<List<ReservationDTO>> getCurrentReservations(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (status == null) {
            return ResponseEntity.ok(reservationService.getAllCurrentReservations(getCurrentPharmacyId()));
        }
        return ResponseEntity
                .ok(reservationService.getCurrentReservationsByStatus(getCurrentPharmacyId(), status, page, size));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<Void> updateReservationStatus(@PathVariable @NonNull Long id, @RequestParam String status) {
        reservationService.updateReservationStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<ReservationDTO> getReservationDetails(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(reservationService.getReservationDetails(id));
    }
}
