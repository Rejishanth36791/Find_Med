package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class ActivityResponse {
    private List<ActivityReservationDTO> activeReservations;
    private List<ActivityReservationDTO> reservationHistory;

    @Data
    @Builder
    public static class ActivityReservationDTO {
        private Long reservationId;
        private String medicineName;
        private String pharmacyName;
        private Integer quantity;
        private LocalDate reservationDate;
        private LocalDate expiryDate; // For active
        private LocalDate completedDate; // For history
        private ReservationStatus status;
    }
}
