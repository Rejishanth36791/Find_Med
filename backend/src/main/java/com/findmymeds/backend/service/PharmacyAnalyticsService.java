package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.PharmacyAnalyticsDto;
import com.findmymeds.backend.repository.PharmacyInventoryRepository;
import com.findmymeds.backend.repository.ReservationItemRepository;
import com.findmymeds.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyAnalyticsService {

    private final ReservationRepository reservationRepository;
    private final PharmacyInventoryRepository inventoryRepository;
    private final ReservationItemRepository reservationItemRepository;

    public PharmacyAnalyticsDto getPharmacyAnalytics(Long pharmacyId) {
        PharmacyAnalyticsDto dto = new PharmacyAnalyticsDto();

        // 1. Total Revenue
        dto.setTotalRevenue(reservationRepository.calculateTotalRevenueByPharmacyId(pharmacyId));

        // 2. Reservation Status Counts
        List<Object[]> statusCounts = reservationRepository.countReservationsByStatus(pharmacyId);
        Map<String, Long> resMap = new HashMap<>();
        for (Object[] row : statusCounts) {
            String status = row[0] != null ? row[0].toString() : "UNKNOWN";
            Long count = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            resMap.put(status, count);
        }
        dto.setReservationStatusCounts(resMap);

        // 3. Inventory Status Counts
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);

        Map<String, Long> invMap = new HashMap<>();
        invMap.put("In Stock", inventoryRepository.countInStock(pharmacyId, thirtyDaysLater));
        invMap.put("Low Stock", inventoryRepository.countLowStock(pharmacyId, thirtyDaysLater));
        invMap.put("Out of Stock", inventoryRepository.countOutOfStock(pharmacyId, thirtyDaysLater));
        invMap.put("Expired", inventoryRepository.countExpired(pharmacyId, today));
        invMap.put("Expiring Soon", inventoryRepository.countExpiringSoon(pharmacyId, today, thirtyDaysLater));
        invMap.put("Deactivated", inventoryRepository.countDeactivated(pharmacyId));
        dto.setInventoryStatusCounts(invMap);

        // 4. Top Selling Medicines (Top 5)
        dto.setTopSellingMedicines(reservationItemRepository.findTopSellingMedicines(pharmacyId, PageRequest.of(0, 5)));

        // 5. Daily Revenue (Last 30 Days)
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<Object[]> dailyRev = reservationRepository.findDailyRevenue(pharmacyId, since);
        List<PharmacyAnalyticsDto.DailyRevenueDto> dailyList = dailyRev.stream()
                .map(row -> {
                    String dateStr = row[0] != null ? row[0].toString() : "";
                    double revenue = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
                    return new PharmacyAnalyticsDto.DailyRevenueDto(dateStr, revenue);
                })
                .collect(Collectors.toList());
        dto.setDailyRevenue(dailyList);

        return dto;
    }
}
