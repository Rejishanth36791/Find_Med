package com.findmymeds.backend.dto;

import lombok.Data;

@Data
public class MedicineDTO {
    private Long id;
    private String medicineName;
    private String brand;
    private Double price;
}
