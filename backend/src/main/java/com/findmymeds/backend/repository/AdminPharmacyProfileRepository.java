package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.PharmacyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminPharmacyProfileRepository extends JpaRepository<PharmacyProfile, Long> {
    Optional<PharmacyProfile> findByPharmacyId(Long pharmacyId);
}
