package com.findmymeds.backend.service;

import com.findmymeds.backend.model.Medicine;
import com.findmymeds.backend.repository.MedicineRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminMedicineService {

    private final MedicineRepository medicineRepository;

    public AdminMedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    // --- READ OPERATIONS ---

    public Page<Medicine> getMedicines(String search, Medicine.MedicineType type, Medicine.MedicineStatus status,
            Pageable pageable) {
        Specification<Medicine> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isFalse(root.get("removed")));

            if (StringUtils.hasText(search)) {
                String likePattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("medicineName")), likePattern));
            }

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return medicineRepository.findAll(spec, pageable != null ? pageable : Pageable.unpaged());
    }

    public Map<String, Object> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Summary Counts
        metrics.put("total", medicineRepository.countByRemovedFalse());
        metrics.put("active", medicineRepository.countByStatusAndRemovedFalse(Medicine.MedicineStatus.ACTIVE));
        metrics.put("inactive", medicineRepository.countByStatusAndRemovedFalse(Medicine.MedicineStatus.INACTIVE));

        // Type Counts
        Map<String, Long> typeCounts = new HashMap<>();
        for (Medicine.MedicineType type : Medicine.MedicineType.values()) {
            typeCounts.put(type.name(), medicineRepository.countByTypeAndRemovedFalse(type));
        }
        metrics.put("byType", typeCounts);

        return metrics;
    }

    public List<Medicine> getRecentNotifications() {
        return medicineRepository.findTop5ByRemovedFalseOrderByLastUpdatedDesc();
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findByIdAndRemovedFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
    }

    // --- WRITE OPERATIONS ---

    public Medicine createMedicine(Medicine medicine) {
        if (medicineRepository.existsByMedicineNameIgnoreCaseAndRemovedFalse(medicine.getMedicineName())) {
            throw new IllegalArgumentException("Medicine with this name already exists");
        }
        return medicineRepository.save(medicine);
    }

    public Medicine updateMedicine(Long id, Medicine updatedMedicine) {
        Medicine existing = getMedicineById(id);

        existing.setMedicineName(updatedMedicine.getMedicineName());
        existing.setGenericName(updatedMedicine.getGenericName());
        existing.setType(updatedMedicine.getType());
        existing.setManufacturer(updatedMedicine.getManufacturer());
        existing.setCountryOfManufacture(updatedMedicine.getCountryOfManufacture());
        existing.setRegistrationNumber(updatedMedicine.getRegistrationNumber());
        existing.setImageUrl(updatedMedicine.getImageUrl());
        existing.setDosageForm(updatedMedicine.getDosageForm());
        existing.setStrength(updatedMedicine.getStrength());
        existing.setStorageInstructions(updatedMedicine.getStorageInstructions());
        existing.setNotes(updatedMedicine.getNotes());
        existing.setDescription(updatedMedicine.getDescription());

        // Status is handled separately for safety, but if passed here we can update it
        // too.
        // Usually status changes via activate/deactivate actions.

        return medicineRepository.save(existing);
    }

    public void updateStatus(Long id, Medicine.MedicineStatus status) {
        Medicine existing = getMedicineById(id);
        existing.setStatus(status);
        medicineRepository.save(existing);
    }

    public void removeMedicine(Long id) {
        Medicine existing = getMedicineById(id);
        existing.setRemoved(true);
        medicineRepository.save(existing);
    }
}
