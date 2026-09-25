package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.PharmacyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyReportRepository extends JpaRepository<PharmacyReport, Long> {
    List<PharmacyReport> findByPharmacyIdOrderByCreatedAtDesc(Long pharmacyId);
}
