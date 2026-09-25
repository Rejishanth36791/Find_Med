package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.Reservation;
import com.findmymeds.backend.model.enums.ReservationStatus;
import com.findmymeds.backend.repository.projection.ReservationCountByDate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

        @Query("""
                            SELECT COUNT(r)
                            FROM Reservation r
                            WHERE r.pharmacy.id = :pharmacyId
                              AND r.reservationDate >= :start
                              AND r.reservationDate < :end
                        """)
        long countByPharmacyIdAndDateBetween(
                        @Param("pharmacyId") Long pharmacyId,
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end);

        @Query("""
                            SELECT COUNT(r)
                            FROM Reservation r
                            WHERE r.pharmacy.id = :pharmacyId
                              AND r.status = :status
                        """)
        long countByPharmacyIdAndStatus(
                        @Param("pharmacyId") Long pharmacyId,
                        @Param("status") ReservationStatus status);

        @Query("""
                            SELECT function('date', r.reservationDate) AS date, COUNT(r) AS count
                            FROM Reservation r
                            WHERE r.reservationDate >= :from
                            GROUP BY function('date', r.reservationDate)
                            ORDER BY function('date', r.reservationDate)
                        """)
        List<ReservationCountByDate> countReservationsPerDay(
                        @Param("from") LocalDateTime from);

        @Query("""
                            SELECT COALESCE(SUM(r.totalAmount), 0)
                            FROM Reservation r
                            WHERE r.pharmacy.id = :pharmacyId
                              AND r.status = 'COLLECTED'
                        """)
        Double calculateTotalRevenueByPharmacyId(@Param("pharmacyId") Long pharmacyId);

        List<Reservation> findByCivilianIdOrderByReservationDateDesc(Long civilianId);

        long countByStatus(ReservationStatus status);

        List<Reservation> findByStatus(ReservationStatus status, Pageable pageable);

        List<Reservation> findByPharmacyIdAndStatus(Long pharmacyId, ReservationStatus status, Pageable pageable);

        @Query("""
                            SELECT function('date', r.reservationDate) as date, COALESCE(SUM(r.totalAmount), 0) as revenue
                            FROM Reservation r
                            WHERE r.pharmacy.id = :pharmacyId AND r.status = 'COLLECTED' AND r.reservationDate >= :since
                            GROUP BY function('date', r.reservationDate)
                            ORDER BY function('date', r.reservationDate)
                        """)
        List<Object[]> findDailyRevenue(@Param("pharmacyId") Long pharmacyId, @Param("since") LocalDateTime since);

        @Query("""
                            SELECT r.status, COUNT(r)
                            FROM Reservation r
                            WHERE r.pharmacy.id = :pharmacyId
                            GROUP BY r.status
                        """)
        List<Object[]> countReservationsByStatus(@Param("pharmacyId") Long pharmacyId);

        long countByCivilianId(Long civilianId);

        long countByCivilianIdAndStatus(Long civilianId, ReservationStatus status);

        @Query("SELECT r FROM Reservation r WHERE r.civilian.id = :civilianId AND r.status IN :statuses ORDER BY r.reservationDate DESC")
        List<Reservation> findByCivilianIdAndStatusIn(@Param("civilianId") Long civilianId,
                        @Param("statuses") List<ReservationStatus> statuses);

        @Query("SELECT r FROM Reservation r WHERE r.civilian.id = :civilianId AND r.status IN :statuses ORDER BY r.pickupDate DESC")
        List<Reservation> findHistoryByCivilianIdAndStatusIn(@Param("civilianId") Long civilianId,
                        @Param("statuses") List<ReservationStatus> statuses);
}
