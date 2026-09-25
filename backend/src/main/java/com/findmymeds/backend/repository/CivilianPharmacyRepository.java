package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CivilianPharmacyRepository extends JpaRepository<Pharmacy, Long> {
    List<Pharmacy> findByNameContainingIgnoreCase(String name);

    // Haversine formula to find pharmacies within radius (in km)
    // Results are sorted by distance
    @Query(value = "SELECT *, ( 6371 * acos( cos( radians(:lat) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(:lng) ) + sin( radians(:lat) ) * sin( radians( latitude ) ) ) ) AS distance FROM pharmacy HAVING distance < :radius ORDER BY distance ASC", nativeQuery = true)
    List<Pharmacy> findNearby(@Param("lat") double lat, @Param("lng") double lng, @Param("radius") double radius);
}
