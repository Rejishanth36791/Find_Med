package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.enums.AccountStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CivilianRepository extends JpaRepository<Civilian, Long> {

  long countByAccountStatus(AccountStatus status);

  boolean existsByEmail(String email);

  java.util.Optional<Civilian> findByEmail(String email);

  java.util.Optional<Civilian> findByNicNumber(String nicNumber);

  @Query("""
          SELECT c FROM Civilian c
          WHERE (:status IS NULL OR c.accountStatus = :status)
            AND (
              :search IS NULL OR :search = '' OR
              LOWER(c.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR
              LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
              LOWER(c.nicNumber) LIKE LOWER(CONCAT('%', :search, '%'))
            )
      """)
  Page<Civilian> search(@Param("status") AccountStatus status,
      @Param("search") String search,
      Pageable pageable);

  List<Civilian> findByAccountStatus(AccountStatus status);

  @Query("""
          SELECT c FROM Civilian c
          WHERE c.accountStatus = :status
            AND c.banDate IS NOT NULL
            AND c.banDate < :cutoff
      """)
  List<Civilian> findTempBannedBefore(@Param("status") AccountStatus status,
      @Param("cutoff") LocalDateTime cutoff);

  @Query("""
          SELECT c FROM Civilian c
          WHERE c.accountStatus = :status
            AND c.permanentBanDate IS NOT NULL
            AND c.permanentBanDate < :cutoff
      """)
  List<Civilian> findPermanentBannedBefore(@Param("status") AccountStatus status,
      @Param("cutoff") LocalDateTime cutoff);
}
