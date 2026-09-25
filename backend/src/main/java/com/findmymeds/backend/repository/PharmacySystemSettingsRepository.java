package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.PharmacySystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PharmacySystemSettingsRepository extends JpaRepository<PharmacySystemSettings, Long> {
    Optional<PharmacySystemSettings> findByPharmacyId(Long pharmacyId);
}
