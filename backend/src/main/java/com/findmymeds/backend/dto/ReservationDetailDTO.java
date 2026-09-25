package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ReservationDetailDTO {
    private Long reservationId;
    private MedicineInfo medicine;
    private PharmacyInfo pharmacy;
    private ReservationInfo reservationDetails;
    private BillingInfo billing;

    @Data
    @Builder
    public static class MedicineInfo {
        private String name;
        private String genericName;
        private String category;
        private boolean prescriptionRequired;
        private Integer quantity;
    }

    @Data
    @Builder
    public static class PharmacyInfo {
        private String name;
        private String location;
        private String contact;
    }

    @Data
    @Builder
    public static class ReservationInfo {
        private LocalDate pickupDate;
        private String prescriptionFile;
        private String notes;
        private ReservationStatus status;
        private String timeframe;
    }

    @Data
    @Builder
    public static class BillingInfo {
        private Double unitPrice;
        private Double total;
        private Double grandTotal;
    }
}
