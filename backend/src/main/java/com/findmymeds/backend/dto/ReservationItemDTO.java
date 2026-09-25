package com.findmymeds.backend.dto;

import lombok.Data;

@Data
public class ReservationItemDTO {

    private Long id;
    private MedicineDTO medicine;
    private int quantity;
    private Double price;

    // Getters and Setters
}
