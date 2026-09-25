package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.Admin;
import com.findmymeds.backend.model.enums.AdminStatus;
import com.findmymeds.backend.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    long countByStatus(AdminStatus status);
}