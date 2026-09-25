package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.CivilianAppeal;
import com.findmymeds.backend.model.enums.AppealStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CivilianAppealRepository extends JpaRepository<CivilianAppeal, Long> {

    long countByStatus(AppealStatus status);

    long countByCivilianId(Long civilianId);

    boolean existsByCivilianIdAndAppealNumber(Long civilianId, Integer appealNumber);

    boolean existsByCivilianIdAndStatus(Long civilianId, AppealStatus status);

    Optional<CivilianAppeal> findTopByCivilianIdOrderByCreatedAtDesc(Long civilianId);

    List<CivilianAppeal> findByCivilianIdOrderByCreatedAtDesc(Long civilianId);

    boolean existsByCivilianIdAndCreatedAtAfter(Long civilianId, LocalDateTime time);

    org.springframework.data.domain.Page<CivilianAppeal> findByStatus(AppealStatus status,
            org.springframework.data.domain.Pageable pageable);

}
