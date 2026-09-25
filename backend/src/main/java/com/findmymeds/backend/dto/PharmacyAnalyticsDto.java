package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PharmacyAnalyticsDto {
    // Data Transfer Object for Analytics
    private double totalRevenue;
    private Map<String, Long> reservationStatusCounts;
    private Map<String, Long> inventoryStatusCounts;
    private List<TopMedicineDto> topSellingMedicines;
    private List<DailyRevenueDto> dailyRevenue;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyRevenueDto {
        private String date;
        private double revenue;
    }
}
