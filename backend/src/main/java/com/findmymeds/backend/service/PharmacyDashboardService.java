package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.DashboardMetricsDto;
import com.findmymeds.backend.model.enums.ReservationStatus;
import com.findmymeds.backend.repository.PharmacyInventoryRepository;
import com.findmymeds.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class PharmacyDashboardService {

        private final ReservationRepository reservationRepository;
        private final PharmacyInventoryRepository pharmacyInventoryRepository;

        public DashboardMetricsDto getMetrics(Long pharmacyId) {
                LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
                LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

                long todayReservations = reservationRepository.countByPharmacyIdAndDateBetween(
                                pharmacyId,
                                startOfDay,
                                endOfDay);

                long pendingOrders = reservationRepository.countByPharmacyIdAndStatus(
                                pharmacyId,
                                ReservationStatus.PENDING);

                long completedToday = reservationRepository.countByPharmacyIdAndStatus(
                                pharmacyId,
                                ReservationStatus.COLLECTED);

                long rejectedToday = reservationRepository.countByPharmacyIdAndStatus(
                                pharmacyId,
                                ReservationStatus.CANCELLED);

                // Inventory metrics from PharmacyInventoryRepository
                LocalDate today = LocalDate.now();
                LocalDate thirtyDaysFromNow = today.plusDays(30);

                long totalMedicines = pharmacyInventoryRepository.countByPharmacyId(pharmacyId);
                long inStock = pharmacyInventoryRepository.countInStock(pharmacyId, thirtyDaysFromNow);
                long lowStock = pharmacyInventoryRepository.countLowStock(pharmacyId, thirtyDaysFromNow);
                long outOfStock = pharmacyInventoryRepository.countOutOfStock(pharmacyId, thirtyDaysFromNow);
                long expiringSoon = pharmacyInventoryRepository.countExpiringSoon(pharmacyId, today, thirtyDaysFromNow);

                // Calculate total revenue (sum of completed order amounts) - default to 0 for
                // now
                double totalRevenue = reservationRepository.calculateTotalRevenueByPharmacyId(pharmacyId);

                return new DashboardMetricsDto(
                                todayReservations,
                                completedToday,
                                rejectedToday,
                                inStock,
                                pendingOrders,
                                outOfStock,
                                expiringSoon,
                                lowStock,
                                totalMedicines,
                                totalRevenue);
        }
}
