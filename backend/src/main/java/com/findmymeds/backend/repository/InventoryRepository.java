package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.PharmacyInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

@Repository
public interface InventoryRepository extends JpaRepository<PharmacyInventory, Long> {

    @Query("SELECT COUNT(i) FROM PharmacyInventory i WHERE i.pharmacy.id = :pharmacyId AND i.availableQuantity = 0")
    long countOutOfStock(Long pharmacyId);

    @Query("SELECT COUNT(i) FROM PharmacyInventory i WHERE i.pharmacy.id = :pharmacyId AND i.availableQuantity > 0")
    long countInStock(Long pharmacyId);

    @Query("SELECT COUNT(i) FROM PharmacyInventory i WHERE i.pharmacy.id = :pharmacyId AND i.expiryDate BETWEEN :start AND :end")
    long countExpiringSoon(@Param("pharmacyId") Long pharmacyId, @Param("start") LocalDate start,
            @Param("end") LocalDate end);
}
