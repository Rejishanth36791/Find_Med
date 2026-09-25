package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.AdminReportInquiry;
import com.findmymeds.backend.model.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminReportRepository extends JpaRepository<AdminReportInquiry, Long> {


    List<AdminReportInquiry> findBySubmittedByAdminIdOrderByCreatedAtDesc(Long submittedByAdminId);

    List<AdminReportInquiry> findByStatusOrderByCreatedAtDesc(ReportStatus status);

    long countByStatus(ReportStatus status);

    List<AdminReportInquiry> findByStatusInAndUpdatedAtBefore(
            List<ReportStatus> statuses, LocalDateTime date);
}