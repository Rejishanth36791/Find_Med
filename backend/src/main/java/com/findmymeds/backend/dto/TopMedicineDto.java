package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopMedicineDto {
    private String medicineName;
    private long quantitySold;
    private double totalRevenue;
}
