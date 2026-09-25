package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.MedicineDetailDTO;
import com.findmymeds.backend.dto.MedicineInventoryDTO;
import com.findmymeds.backend.dto.MedicineInventoryMetricsDTO;
import com.findmymeds.backend.service.PharmacyMedicineInventoryService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/pharmacy/inventory")
@lombok.RequiredArgsConstructor
@PreAuthorize("hasRole('PHARMACY')")
public class PharmacyMedicineInventoryController {

    private final PharmacyMedicineInventoryService inventoryService;

    @GetMapping("/metrics")
    public ResponseEntity<MedicineInventoryMetricsDTO> getMetrics() {
        return ResponseEntity.ok(inventoryService.getInventoryMetrics());
    }

    @GetMapping
    public ResponseEntity<Page<MedicineInventoryDTO>> getInventory(
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(inventoryService.getInventory(filter, search, page, size));
    }

    @GetMapping("/{medicineId}")
    public ResponseEntity<MedicineDetailDTO> getMedicineDetails(
            @PathVariable("medicineId") Long medicineId) {
        if (medicineId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(inventoryService.getMedicineDetails(medicineId));
    }

    @PatchMapping("/{id}/price")
    public ResponseEntity<Void> updatePrice(@PathVariable("id") Long id, @RequestParam java.math.BigDecimal price) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        inventoryService.updatePrice(id, price);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<Void> updateQuantity(@PathVariable("id") Long id, @RequestParam Integer quantity) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        inventoryService.updateStock(id, quantity);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable("id") Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        inventoryService.deactivateMedicine(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activate(@PathVariable("id") Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        inventoryService.activateMedicine(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        inventoryService.deleteFromInventory(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<Void> addMedicine(@RequestBody MedicineInventoryDTO dto) {
        inventoryService.addMedicineToInventory(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateMedicine(@PathVariable("id") Long id, @RequestBody MedicineInventoryDTO dto) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        inventoryService.updateInventory(id, dto);
        return ResponseEntity.ok().build();
    }
}
