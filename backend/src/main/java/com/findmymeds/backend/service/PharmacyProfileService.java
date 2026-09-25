package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.PharmacyProfileDto;
import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.model.PharmacyProfile;
import com.findmymeds.backend.repository.PharmacyProfileRepository;
import com.findmymeds.backend.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PharmacyProfileService {

    private final PharmacyRepository pharmacyRepository;
    private final PharmacyProfileRepository pharmacyProfileRepository;

    public PharmacyProfileDto getProfile(Long pharmacyId) {
        if (pharmacyId == null) {
            throw new IllegalArgumentException("Pharmacy ID cannot be null");
        }
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
        dto.setDistrict(pharmacy.getDistrict());
        dto.setRating(pharmacy.getRating());
        dto.setRegisteredDate(pharmacy.getCreatedAt());

        if (pharmacy.getStatus() != null) {
            dto.setLicenseStatus(pharmacy.getStatus().name());
        }

        if (profile != null) {
            dto.setLicenseDocument(profile.getLicenseDocument());
            dto.setLogoPath(profile.getLogoPath());
            // dto.setVerified(profile.getVerified()); // Skipping as model returns null/has
            // no field
        }

        return dto;
    }

    @Transactional
    public void updateProfile(Long pharmacyId, PharmacyProfileDto dto) {
        if (pharmacyId == null) {
            throw new IllegalArgumentException("Pharmacy ID cannot be null");
        }
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

        pharmacy.setName(dto.getName());
        pharmacy.setAddress(dto.getAddress());
        pharmacy.setPhone(dto.getContactNumber());
        pharmacy.setOperatingHours(dto.getOperatingHours());
        pharmacy.setOwnerName(dto.getOwnerName());
        pharmacy.setNic(dto.getNic());
        pharmacy.setDistrict(dto.getDistrict());

        pharmacyRepository.save(pharmacy);

        PharmacyProfile profile = pharmacyProfileRepository.findByPharmacyId(pharmacyId)
                .orElse(new PharmacyProfile());

        if (profile.getPharmacy() == null) {
            profile.setPharmacy(pharmacy);
        }

        profile.setLogoPath(dto.getLogoPath());

        pharmacyProfileRepository.save(profile);
    }

    @Transactional
    public String uploadLogo(Long pharmacyId, org.springframework.web.multipart.MultipartFile file) {
        if (pharmacyId == null) {
            throw new IllegalArgumentException("Pharmacy ID cannot be null");
        }

        try {
            // Create uploads directory if not exists
            String uploadDir = "uploads/pharmacy-logos/";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            // Save file
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";

            String filename = "pharmacy_" + pharmacyId + "_logo_" + System.currentTimeMillis() + extension;
            java.nio.file.Path filePath = uploadPath.resolve(filename);

            java.nio.file.Files.copy(file.getInputStream(), filePath,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Update profile
            PharmacyProfile profile = pharmacyProfileRepository.findByPharmacyId(pharmacyId)
                    .orElse(new PharmacyProfile());

            if (profile.getPharmacy() == null) {
                Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                        .orElseThrow(() -> new RuntimeException("Pharmacy not found"));
                profile.setPharmacy(pharmacy);
            }

            String logoUrl = "/uploads/pharmacy-logos/" + filename;
            profile.setLogoPath(logoUrl);
            pharmacyProfileRepository.save(profile);

            return logoUrl;

        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to upload logo", e);
        }
    }
}
