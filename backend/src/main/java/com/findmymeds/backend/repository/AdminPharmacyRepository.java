package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.model.enums.PharmacyStatus;
import com.findmymeds.backend.model.enums.PharmacyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminPharmacyRepository extends JpaRepository<Pharmacy, Long> {
    List<Pharmacy> findByStatus(PharmacyStatus status);
    List<Pharmacy> findByNameContainingIgnoreCase(String query);

List<Pharmacy> findByPharmacyType(PharmacyType pharmacyType);

List<Pharmacy> findByStatusAndPharmacyType(
    PharmacyStatus status,
    PharmacyType pharmacyType
);

}
