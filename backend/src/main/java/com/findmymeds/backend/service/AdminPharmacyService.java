package com.findmymeds.backend.service;

import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.model.enums.PharmacyStatus;
import com.findmymeds.backend.model.enums.PharmacyType;
import com.findmymeds.backend.repository.AdminPharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminPharmacyService {

    @Autowired
    private AdminPharmacyRepository pharmacyRepository;

    // 🔹 Get all pharmacies, optional filtering by status/type
    public List<Pharmacy> getPharmacies(PharmacyStatus status, PharmacyType type) {
        if (status != null && type != null) {
            return pharmacyRepository.findByStatusAndPharmacyType(status, type);
        }
        if (status != null) {
            return pharmacyRepository.findByStatus(status);
        }
        if (type != null) {
            return pharmacyRepository.findByPharmacyType(type);
        }
        return pharmacyRepository.findAll();
    }

    // 🔹 Get all pharmacies (unfiltered)
    public List<Pharmacy> getAllPharmacies() {
        return pharmacyRepository.findAll();
    }

    // 🔹 Get pharmacy by ID (details page)
    public Pharmacy getPharmacyById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return pharmacyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));
    }

    // 🔹 Get rejected pharmacy by ID (rejected details page)
    public Pharmacy getRejectedPharmacyById(Long id) {
        Pharmacy pharmacy = getPharmacyById(id);
        if (pharmacy.getStatus() != PharmacyStatus.REJECTED) {
            throw new RuntimeException("Pharmacy is not rejected");
        }
        return pharmacy;
    }

    // 🔹 Create pharmacy (pharmacyType REQUIRED)
    public Pharmacy createPharmacy(Pharmacy pharmacy) {
        if (pharmacy.getPharmacyType() == null) {
            throw new RuntimeException("pharmacyType is required");
        }
        // Default status is ACTIVE when creating a new pharmacy
        if (pharmacy.getStatus() == null) {
            pharmacy.setStatus(PharmacyStatus.ACTIVE);
        }
        return pharmacyRepository.save(pharmacy);
    }

    // 🔹 Update pharmacy details (name, type, address, etc.)
    public Pharmacy updatePharmacyDetails(Long id, Pharmacy updatedPharmacy) {
        Pharmacy pharmacy = getPharmacyById(id);

        // Update editable fields
        pharmacy.setName(updatedPharmacy.getName());
        pharmacy.setPhone(updatedPharmacy.getPhone());
        pharmacy.setAddress(updatedPharmacy.getAddress());
        pharmacy.setEmail(updatedPharmacy.getEmail());
        pharmacy.setOwnerName(updatedPharmacy.getOwnerName());
        pharmacy.setOperatingHours(updatedPharmacy.getOperatingHours());
        pharmacy.setLatitude(updatedPharmacy.getLatitude());
        pharmacy.setLongitude(updatedPharmacy.getLongitude());
        pharmacy.setPharmacyType(updatedPharmacy.getPharmacyType());

        return pharmacyRepository.save(pharmacy);
    }

    // 🔹 Update pharmacy status safely
    public Pharmacy updatePharmacyStatus(Long id, PharmacyStatus status) {
        Pharmacy pharmacy = getPharmacyById(id);

        // Only allow transitions to ACTIVE, SUSPENDED, REMOVED
        if (status == PharmacyStatus.ACTIVE ||
                status == PharmacyStatus.SUSPENDED ||
                status == PharmacyStatus.REJECTED ||
                status == PharmacyStatus.REMOVED) {
            pharmacy.setStatus(status);
            return pharmacyRepository.save(pharmacy);
        } else {
            throw new RuntimeException("Invalid status transition");
        }
    }

    // 🔹 Search pharmacies by name
    public List<Pharmacy> searchPharmacies(String query) {
        if (query == null || query.isEmpty()) {
            return pharmacyRepository.findAll();
        }
        return pharmacyRepository.findByNameContainingIgnoreCase(query);
    }

    // 🔹 Filter by status
    public List<Pharmacy> getPharmaciesByStatus(PharmacyStatus status) {
        return pharmacyRepository.findByStatus(status);
    }
}
