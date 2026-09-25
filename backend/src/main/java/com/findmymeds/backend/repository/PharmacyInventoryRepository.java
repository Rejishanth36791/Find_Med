package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.PharmacyInventory;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PharmacyInventoryRepository extends JpaRepository<PharmacyInventory, Long> {

        @Query("SELECT pi FROM PharmacyInventory pi WHERE pi.pharmacy.id = :pharmacyId AND " +
                        "(:search IS NULL OR LOWER(pi.medicine.medicineName) LIKE LOWER(CONCAT('%', :search, '%')) OR "
                        +
                        "LOWER(pi.medicine.genericName) LIKE LOWER(CONCAT('%', :search, '%')))")
        Page<PharmacyInventory> findByPharmacyIdAndSearch(@Param("pharmacyId") Long pharmacyId,
                        @Param("search") String search,
                        Pageable pageable);

        // Metrics Queries
        long countByPharmacyId(Long pharmacyId);

        @Query("SELECT COUNT(pi) FROM PharmacyInventory pi WHERE pi.pharmacy.id = :pharmacyId AND pi.medicine.status = 'ACTIVE' "
                        +
                        "AND (pi.expiryDate IS NULL OR pi.expiryDate > :thirtyDaysLater) AND pi.availableQuantity > 10")
        long countInStock(@Param("pharmacyId") Long pharmacyId,
                        @Param("thirtyDaysLater") java.time.LocalDate thirtyDaysLater);

        @Query("SELECT COUNT(pi) FROM PharmacyInventory pi WHERE pi.pharmacy.id = :pharmacyId AND pi.medicine.status = 'ACTIVE' "
                        +
                        "AND (pi.expiryDate IS NULL OR pi.expiryDate > :thirtyDaysLater) AND pi.availableQuantity > 0 AND pi.availableQuantity <= 10")
        long countLowStock(@Param("pharmacyId") Long pharmacyId,
                        @Param("thirtyDaysLater") java.time.LocalDate thirtyDaysLater);

        @Query("SELECT COUNT(pi) FROM PharmacyInventory pi WHERE pi.pharmacy.id = :pharmacyId AND pi.medicine.status = 'ACTIVE' "
                        +
                        "AND (pi.expiryDate IS NULL OR pi.expiryDate > :thirtyDaysLater) AND pi.availableQuantity = 0")
        long countOutOfStock(@Param("pharmacyId") Long pharmacyId,
                        @Param("thirtyDaysLater") java.time.LocalDate thirtyDaysLater);

        @Query("SELECT COUNT(pi) FROM PharmacyInventory pi WHERE pi.pharmacy.id = :pharmacyId AND pi.medicine.status = 'INACTIVE'")
        long countDeactivated(@Param("pharmacyId") Long pharmacyId);

        @Query("SELECT COUNT(pi) FROM PharmacyInventory pi WHERE pi.pharmacy.id = :pharmacyId AND pi.medicine.status = 'ACTIVE' "
                        +
                        "AND pi.expiryDate < :today")
        long countExpired(@Param("pharmacyId") Long pharmacyId, @Param("today") java.time.LocalDate today);

        @Query("SELECT COUNT(pi) FROM PharmacyInventory pi WHERE pi.pharmacy.id = :pharmacyId AND pi.medicine.status = 'ACTIVE' "
                        +
                        "AND pi.expiryDate BETWEEN :today AND :thirtyDaysLater")
        long countExpiringSoon(@Param("pharmacyId") Long pharmacyId, @Param("today") java.time.LocalDate today,
                        @Param("thirtyDaysLater") java.time.LocalDate thirtyDaysLater);

        // Reservation Related
        @Query("SELECT pi FROM PharmacyInventory pi WHERE pi.medicine.id = :medicineId " +
                        "AND pi.availableQuantity >= :requiredQuantity " +
                        "AND pi.pharmacy.status = 'ACTIVE' " +
                        "ORDER BY pi.availableQuantity DESC")
        List<PharmacyInventory> findPharmaciesWithStock(@Param("medicineId") Long medicineId,
                        @Param("requiredQuantity") Integer requiredQuantity);

        Optional<PharmacyInventory> findByPharmacyIdAndMedicineId(Long pharmacyId, Long medicineId);
}
