package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PharmacyInventoryDTO {

    private Long pharmacyId;
    private String pharmacyName;
    private String city;
    private String contact;
    private Integer availableQuantity;
}

