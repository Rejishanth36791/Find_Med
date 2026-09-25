package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.CivilianReport;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.model.enums.ReportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface CivilianReportRepository extends JpaRepository<CivilianReport, Long> {

    long countByStatus(ReportStatus status);

    @Query("""
        SELECT r FROM CivilianReport r
        WHERE (:type IS NULL OR r.type = :type)
          AND (:status IS NULL OR r.status = :status)
          AND (
               :search IS NULL OR :search = '' OR
               LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(r.referenceCode) LIKE LOWER(CONCAT('%', :search, '%'))
          )
        """)
    Page<CivilianReport> search(ReportType type, ReportStatus status, String search, Pageable pageable);

    List<CivilianReport> findByStatusInAndStatusChangedAtBefore(
            List<ReportStatus> statuses,
            LocalDateTime cutoff
    );
}
