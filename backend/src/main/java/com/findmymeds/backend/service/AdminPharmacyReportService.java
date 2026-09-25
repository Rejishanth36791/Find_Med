package com.findmymeds.backend.service;

import com.findmymeds.backend.model.PharmacyReport;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.repository.AdminPharmacyReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminPharmacyReportService {

    @Autowired
    private AdminPharmacyReportRepository reportRepository;

    public List<PharmacyReport> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status);
    }

    public List<PharmacyReport> getReportsByPharmacy(Long pharmacyId) {
        return reportRepository.findByPharmacyId(pharmacyId);
    }

    public PharmacyReport saveReport(@org.springframework.lang.NonNull PharmacyReport report) {
        return reportRepository.save(report);
    }

    public PharmacyReport updateReportStatus(@org.springframework.lang.NonNull Long reportId, ReportStatus status) {
        PharmacyReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(status);
        return reportRepository.save(report);
    }
}
