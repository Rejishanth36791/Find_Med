package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.DeletedCivilian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeletedCivilianRepository extends JpaRepository<DeletedCivilian, Long> {

    boolean existsByOriginalCivilianId(Long originalCivilianId);
}
