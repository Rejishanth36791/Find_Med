package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.AdminActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminActionLogRepository extends JpaRepository<AdminActionLog, Long> {

    List<AdminActionLog> findByAdminIdOrderByCreatedAtDesc(Long adminId);

    List<AdminActionLog> findByTargetIdAndTargetTableOrderByCreatedAtDesc(
            Long targetId, String targetTable);
}
