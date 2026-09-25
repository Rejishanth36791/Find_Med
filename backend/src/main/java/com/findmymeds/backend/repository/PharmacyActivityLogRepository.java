package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.PharmacyActivityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyActivityLogRepository extends JpaRepository<PharmacyActivityLog, Long> {
    List<PharmacyActivityLog> findByPharmacyIdOrderByTimestampDesc(Long pharmacyId, Pageable pageable);
}
