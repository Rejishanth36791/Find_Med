package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.PharmacyInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminPharmacyInventoryRepository extends JpaRepository<PharmacyInventory, Long> {
    List<PharmacyInventory> findByPharmacyId(Long pharmacyId);
}
