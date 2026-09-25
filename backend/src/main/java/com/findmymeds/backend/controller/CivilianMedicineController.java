package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.MedicineSearchResponse;
import com.findmymeds.backend.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/civilian/medicine")
public class CivilianMedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping("/search")
    public ResponseEntity<MedicineSearchResponse> searchMedicine(@RequestParam String name) {
        // Logic:
        // 1. Search Medicine Registry (case-insensitive) [cite: 924, 931]
        // 2. If found, find pharmacies with stock > 0 for this medicine [cite: 948,
        // 959]
        // 3. Ensure pharmacies are ACTIVE [cite: 961]
        MedicineSearchResponse response = medicineService.getUnifiedSearch(name);
        return ResponseEntity.ok(response);
    }
}
