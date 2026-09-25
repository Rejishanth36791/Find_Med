package com.findmymeds.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminVivoReservationDTO {
    private String reservationId;
    private String status;
    private LocalDateTime reservationDate;

    private Long pharmacyId;
    private String pharmacyName;
}
