package com.findmymeds.backend.repository;

import com.findmymeds.backend.dto.TopMedicineDto;
import com.findmymeds.backend.model.ReservationItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationItemRepository extends JpaRepository<ReservationItem, Long> {

    @Query("""
                SELECT new com.findmymeds.backend.dto.TopMedicineDto(m.medicineName, SUM(ri.quantity), SUM(ri.quantity * ri.price))
                FROM ReservationItem ri
                JOIN ri.medicine m
                JOIN ri.reservation r
                WHERE r.pharmacy.id = :pharmacyId AND r.status = 'COLLECTED'
                GROUP BY m.medicineName
                ORDER BY SUM(ri.quantity) DESC
            """)
    List<TopMedicineDto> findTopSellingMedicines(@Param("pharmacyId") Long pharmacyId, Pageable pageable);
}
