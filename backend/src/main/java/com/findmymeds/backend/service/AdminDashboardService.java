package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.*;
import com.findmymeds.backend.model.Notification;
import com.findmymeds.backend.model.enums.*;
import com.findmymeds.backend.repository.*;
import com.findmymeds.backend.repository.projection.ReservationCountByDate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

        private final CivilianRepository civilianRepository;
        private final AdminRepository adminRepository;
        private final PharmacyRepository pharmacyRepository;
        private final NotificationRepository notificationRepository;
        private final CivilianAppealRepository civilianAppealRepository;
        private final ReservationRepository reservationRepository;

        public AdminDashboardService(
                        CivilianRepository civilianRepository,
                        AdminRepository adminRepository,
                        PharmacyRepository pharmacyRepository,
                        NotificationRepository notificationRepository,
                        CivilianAppealRepository civilianAppealRepository,
                        ReservationRepository reservationRepository) {
                this.civilianRepository = civilianRepository;
                this.adminRepository = adminRepository;
                this.pharmacyRepository = pharmacyRepository;
                this.notificationRepository = notificationRepository;
                this.civilianAppealRepository = civilianAppealRepository;
                this.reservationRepository = reservationRepository;
        }

        public AdminDashboardStatsDTO getDashboardStats() {

                long total = civilianRepository.count();
                long active = civilianRepository.countByAccountStatus(AccountStatus.ACTIVE);
                long tempBanned = civilianRepository.countByAccountStatus(AccountStatus.TEMP_BANNED);
                long permanentBanned = civilianRepository.countByAccountStatus(AccountStatus.PERMANENT_BANNED);

                return new AdminDashboardStatsDTO(
                                total,
                                active,
                                tempBanned,
                                permanentBanned);
        }

        public AdminPendingAlertsDTO getPendingAlerts() {

                long pendingAppeals = civilianAppealRepository.countByStatus(AppealStatus.PENDING);
                long pendingPharmacies = pharmacyRepository.countByStatus(PharmacyStatus.PENDING);
                long unreadNotifications = notificationRepository.countByTargetRoleAndReadFalse(Role.ADMIN);

                long totalAlerts = pendingAppeals + pendingPharmacies + unreadNotifications;

                return new AdminPendingAlertsDTO(
                                totalAlerts,
                                pendingAppeals,
                                pendingPharmacies,
                                unreadNotifications);
        }

        public List<AdminNotificationResponseDTO> getRecentUnreadAdminNotifications() {

                List<Notification> notifications = notificationRepository
                                .findTop2ByTargetRoleAndReadFalseOrderByCreatedAtDesc(Role.ADMIN);

                return notifications.stream()
                                .map(n -> new AdminNotificationResponseDTO(
                                                n.getId(),
                                                n.getTitle(),
                                                n.getMessage(),
                                                n.getNotificationType(),
                                                n.getPriority(),
                                                Boolean.TRUE.equals(n.getRead()),
                                                n.getCreatedAt()))
                                .collect(Collectors.toList());
        }

        public List<AdminChartCountDTO> getCivilianDistributionChart() {

                long active = civilianRepository.countByAccountStatus(AccountStatus.ACTIVE);
                long tempBanned = civilianRepository.countByAccountStatus(AccountStatus.TEMP_BANNED);
                long appealsPending = civilianAppealRepository.countByStatus(AppealStatus.PENDING);

                return List.of(
                                new AdminChartCountDTO("ACTIVE", active),
                                new AdminChartCountDTO("TEMP_BANNED", tempBanned),
                                new AdminChartCountDTO("APPEALS_PENDING", appealsPending));
        }

        public List<AdminChartCountDTO> getPharmacyHealthChart() {
                return List.of(
                                new AdminChartCountDTO("PENDING",
                                                pharmacyRepository.countByStatus(PharmacyStatus.PENDING)),
                                new AdminChartCountDTO("ACTIVE",
                                                pharmacyRepository.countByStatus(PharmacyStatus.ACTIVE)),
                                new AdminChartCountDTO("SUSPENDED",
                                                pharmacyRepository.countByStatus(PharmacyStatus.SUSPENDED)),
                                new AdminChartCountDTO("REMOVED",
                                                pharmacyRepository.countByStatus(PharmacyStatus.REMOVED)));
        }

        public List<AdminChartCountDTO> getAdminStatusChart() {
                return List.of(
                                new AdminChartCountDTO("ACTIVE", adminRepository.countByStatus(AdminStatus.ACTIVE)),
                                new AdminChartCountDTO("DEACTIVATED",
                                                adminRepository.countByStatus(AdminStatus.DEACTIVATED)),
                                new AdminChartCountDTO("REMOVED", adminRepository.countByStatus(AdminStatus.REMOVED)));
        }

        public List<AdminChartTimePointDTO> getReservationVolumeChart(int days) {

                LocalDateTime from = LocalDateTime.now().minusDays(days);

                List<ReservationCountByDate> rows = reservationRepository.countReservationsPerDay(from);

                return rows.stream()
                                .map(r -> new AdminChartTimePointDTO(r.getDate(), r.getCount()))
                                .toList();
        }

        public AdminOverviewSuperDTO getSuperAdminOverview() {

                long totalCivilians = civilianRepository.count();

                long totalAdmins = adminRepository.count();
                long activeAdmins = adminRepository.countByStatus(AdminStatus.ACTIVE);

                long totalPharmacies = pharmacyRepository.count();
                long pendingPharmacies = pharmacyRepository.countByStatus(PharmacyStatus.PENDING);

                return new AdminOverviewSuperDTO(
                                totalCivilians,
                                totalAdmins,
                                activeAdmins,
                                totalPharmacies,
                                pendingPharmacies);
        }

        public AdminOverviewAdminDTO getAdminOverview() {

                long totalCivilians = civilianRepository.count();
                long temporaryBans = civilianRepository.countByAccountStatus(AccountStatus.TEMP_BANNED);
                long pendingAppeals = civilianAppealRepository.countByStatus(AppealStatus.PENDING);
                long pendingPharmacyRequests = pharmacyRepository.countByStatus(PharmacyStatus.PENDING);
                long activePharmacies = pharmacyRepository.countByStatus(PharmacyStatus.ACTIVE);

                return new AdminOverviewAdminDTO(
                                totalCivilians,
                                temporaryBans,
                                pendingAppeals,
                                pendingPharmacyRequests,
                                activePharmacies);
        }

        public AdminNotificationMetricsDTO getNotificationMetrics() {

                long unread = notificationRepository.countByTargetRoleAndReadFalse(Role.ADMIN);
                long read = notificationRepository.countByTargetRoleAndReadTrue(Role.ADMIN);

                return new AdminNotificationMetricsDTO(read, unread);
        }
}
