package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.CivilianHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CivilianHistoryRepository extends JpaRepository<CivilianHistory, Long> {

    Optional<CivilianHistory> findTopByCivilianIdOrderByTimestampDesc(Long civilianId);

    List<CivilianHistory> findTop10ByCivilianIdOrderByTimestampDesc(Long civilianId);


    List<CivilianHistory> findTop50ByCivilianIdOrderByTimestampDesc(Long civilianId);
}
