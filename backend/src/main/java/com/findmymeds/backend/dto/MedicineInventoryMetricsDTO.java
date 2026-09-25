package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineInventoryMetricsDTO {
    private long totalMedicines;
    private long inStock;
    private long lowStock;
    private long outOfStock;
    private long expired;
    private long expiringSoon;
    private long deactivated;
}
