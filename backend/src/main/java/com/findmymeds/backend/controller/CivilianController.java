package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.repository.CivilianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/civilians")

public class CivilianController {

    @Autowired
    private CivilianRepository civilianRepository;

    @GetMapping
    public List<Civilian> getAllCivilians() {
        // In a real app, you might want pagination here
        return civilianRepository.findAll();
    }

    @Autowired
    private com.findmymeds.backend.service.CivilianReservationService civilianReservationService;

    @GetMapping("/{id}/dashboard-stats")
    public org.springframework.http.ResponseEntity<?> getDashboardStats(
            @PathVariable @org.springframework.lang.NonNull Long id) {
        return org.springframework.http.ResponseEntity.ok(civilianReservationService.getDashboardStats(id));
    }

    @GetMapping("/{id}/notifications")
    public org.springframework.http.ResponseEntity<?> getNotifications(
            @PathVariable @org.springframework.lang.NonNull Long id) {
        // Validate that the civilian exists
        if (!civilianRepository.existsById(id)) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        return org.springframework.http.ResponseEntity.ok(civilianReservationService.getNotifications(id));
    }
}
