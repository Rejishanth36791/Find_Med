package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.Medicine;
import com.findmymeds.backend.service.AdminMedicineService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")

public class AdminMedicineController {

    private final AdminMedicineService medicineService;

    public AdminMedicineController(AdminMedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    public ResponseEntity<Page<Medicine>> getMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Medicine.MedicineType type,
            @RequestParam(required = false) Medicine.MedicineStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(medicineService.getMedicines(search, type, status, pageable));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(medicineService.getMetrics());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Medicine>> getNotifications() {
        return ResponseEntity.ok(medicineService.getRecentNotifications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicine(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @PostMapping
    public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.createMedicine(medicine));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, medicine));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam Medicine.MedicineStatus status) {
        medicineService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeMedicine(@PathVariable Long id) {
        medicineService.removeMedicine(id);
        return ResponseEntity.ok().build();
    }
}
