package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.model.enums.PharmacyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    Optional<Pharmacy> findByName(String name);

    Optional<Pharmacy> findByEmail(String email);

    Optional<Pharmacy> findByLicenseNumber(String licenseNumber);

    // Used by Admin Dashboard
    long countByStatus(PharmacyStatus status);
}
