package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.service.CivilianPharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacies")

public class CivilianPharmacyController {

    @Autowired
    private CivilianPharmacyService pharmacyService;

    @GetMapping
    public List<Pharmacy> searchPharmacies(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng) {
        return pharmacyService.searchPharmacies(query, filter, lat, lng);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Pharmacy>> getNearbyPharmacies(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radius) {
        return ResponseEntity.ok(pharmacyService.findNearbyPharmacies(lat, lng, radius));
    }
}
