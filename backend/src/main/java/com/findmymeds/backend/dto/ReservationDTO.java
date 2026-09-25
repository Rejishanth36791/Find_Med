package com.findmymeds.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ReservationDTO {
    private String id;

    private String status;
    private java.time.LocalDateTime reservationDate;
    private String timeframe;
    private Double totalAmount;
    private String prescriptionImageUrl;
    private String note;
    private CivilianDTO civilian;
    private List<ReservationItemDTO> items;
}