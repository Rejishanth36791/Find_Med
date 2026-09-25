package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.CivilianReportLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CivilianReportLogRepository extends JpaRepository<CivilianReportLog, Long> {

    List<CivilianReportLog> findByReportIdOrderByTimestampDesc(Long reportId);
}
