package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicineRepository extends JpaRepository<Medicine, Long>,
                org.springframework.data.jpa.repository.JpaSpecificationExecutor<Medicine> {

        // Metrics
        long countByRemovedFalse();

        long countByStatusAndRemovedFalse(Medicine.MedicineStatus status);

        long countByTypeAndRemovedFalse(Medicine.MedicineType type);

        // Notifications (Recent Activity)
        List<Medicine> findTop5ByRemovedFalseOrderByCreatedAtDesc();

        List<Medicine> findTop5ByRemovedFalseOrderByLastUpdatedDesc();

        // Existence check
        boolean existsByMedicineNameIgnoreCaseAndRemovedFalse(String medicineName);

        Optional<Medicine> findByMedicineNameIgnoreCaseAndRemovedFalse(String medicineName);

        // Basic fetches
        Optional<Medicine> findByIdAndRemovedFalse(Long id);

        List<Medicine> findByMedicineNameContainingIgnoreCaseAndStatusAndRemovedFalse(String name,
                        Medicine.MedicineStatus status);
}
