package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.PharmacyReport;
import com.findmymeds.backend.model.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminPharmacyReportRepository extends JpaRepository<PharmacyReport, Long> {
    List<PharmacyReport> findByStatus(ReportStatus status);

    List<PharmacyReport> findByPharmacyId(Long pharmacyId);

    List<PharmacyReport> findByStatusInAndStatusChangedAtBefore(
            List<ReportStatus> statuses, LocalDateTime date);
}
