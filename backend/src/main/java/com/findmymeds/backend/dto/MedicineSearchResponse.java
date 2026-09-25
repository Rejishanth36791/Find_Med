package com.findmymeds.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class MedicineSearchResponse {
    private boolean medicineFound;
    private MedicineDetailDTO medicineDetails; // From Medicine Registry
    private List<PharmacyInventoryDTO> availablePharmacies; // Only quantity > 0
}
