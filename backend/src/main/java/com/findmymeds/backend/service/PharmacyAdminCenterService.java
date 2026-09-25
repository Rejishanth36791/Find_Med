package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.PharmacyProfileDto;
import com.findmymeds.backend.dto.PharmacyReportDTO;
import com.findmymeds.backend.dto.ReportRequestDto;
import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.model.PharmacyProfile;
import com.findmymeds.backend.model.PharmacyReport;
import com.findmymeds.backend.model.enums.*;
import com.findmymeds.backend.repository.PharmacyProfileRepository;
import com.findmymeds.backend.repository.PharmacyRepository;
import com.findmymeds.backend.repository.PharmacyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyAdminCenterService {

    private final PharmacyRepository pharmacyRepository;
    private final PharmacyProfileRepository pharmacyProfileRepository;
    private final PharmacyReportRepository pharmacyReportRepository;

    public PharmacyProfileDto getProfile(@org.springframework.lang.NonNull Long pharmacyId) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

        PharmacyProfile profile = pharmacyProfileRepository.findByPharmacyId(pharmacyId)
                .orElse(null);

        PharmacyProfileDto dto = new PharmacyProfileDto();
        dto.setId(pharmacy.getId());
        dto.setName(pharmacy.getName());
        dto.setAddress(pharmacy.getAddress());
        dto.setLicenseNumber(pharmacy.getLicenseNumber());
        dto.setRegistrationNo(pharmacy.getRegistrationNo());
        dto.setOwnerName(pharmacy.getOwnerName());
        dto.setNic(pharmacy.getNic());
        dto.setContactNumber(pharmacy.getPhone());
        dto.setEmail(pharmacy.getEmail());
        dto.setOperatingHours(pharmacy.getOperatingHours());
        dto.setRegisteredDate(pharmacy.getCreatedAt());
        dto.setLicenseStatus(pharmacy.getStatus().toString());
        dto.setDistrict(pharmacy.getDistrict());
        dto.setRating(0.0);

        if (profile != null) {
            dto.setLicenseDocument(profile.getLicenseDocument());
            dto.setVerified(pharmacy.getStatus() == PharmacyStatus.ACTIVE);
            dto.setLogoPath(profile.getLogoPath());
        }

        return dto;
    }

    public void submitReport(Long pharmacyId, ReportRequestDto request) {
        if (pharmacyId == null) {
            throw new IllegalArgumentException("Pharmacy ID cannot be null");
        }
        Pharmacy pharmacy = pharmacyRepository.getReferenceById(pharmacyId);
        PharmacyReport report = new PharmacyReport();
        report.setPharmacy(pharmacy);
        report.setDescription(request.getDescription());
        report.setTitle(request.getTitle());

        try {
            report.setType(ReportType.valueOf(request.getType().toUpperCase()));
            report.setIssueCategory(IssueCategory.valueOf(request.getIssueCategory().toUpperCase()));
            report.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        } catch (Exception e) {
            report.setType(ReportType.REPORT);
            report.setIssueCategory(IssueCategory.OTHER);
            report.setPriority(Priority.MEDIUM);
        }

        report.setStatus(ReportStatus.PENDING);
        pharmacyReportRepository.save(report);
    }

    public List<PharmacyReportDTO> getReportHistory(Long pharmacyId) {
        return pharmacyReportRepository.findByPharmacyIdOrderByCreatedAtDesc(pharmacyId)
                .stream()
                .map(report -> {
                    PharmacyReportDTO dto = new PharmacyReportDTO();
                    dto.setId(report.getId());
                    dto.setType(report.getType().toString());
                    dto.setCategory(report.getIssueCategory().toString());
                    dto.setPriority(report.getPriority().toString());
                    dto.setStatus(report.getStatus().toString());
                    dto.setDate(report.getCreatedAt());
                    dto.setTitle(report.getTitle());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
