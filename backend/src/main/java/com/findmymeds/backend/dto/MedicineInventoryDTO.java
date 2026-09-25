package com.findmymeds.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MedicineInventoryDTO {
    private Long inventoryId;
    private Long medicineId;
    private String medicineName;
    private String genericName;
    private String activeIngredients;
    private String manufacturer;
    private String dosageForm;
    private String strength;
    private boolean requiresPrescription;
    private Integer stockQuantity;
    private BigDecimal price;
    private String status; // Derived from Medicine status or stock level
    private String imageUrl;
    private LocalDate expiryDate;
}
