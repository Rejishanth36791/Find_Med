package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.AdminProfileDTO;
import com.findmymeds.backend.model.*;
import com.findmymeds.backend.model.enums.Role;
import com.findmymeds.backend.model.enums.AdminStatus; // <--- Added Import
import com.findmymeds.backend.repository.AdminActionLogRepository;
import com.findmymeds.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AdminService {

    private final AdminRepository adminRepository;
    private final AdminActionLogRepository actionLogRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminResponse> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AdminResponse getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with id: " + id));
        return mapToResponse(admin);
    }

    public Optional<Admin> getAdminEntityById(Long id) {
        return adminRepository.findById(id);
    }

    public List<Admin> getAllAdminEntities() {
        return adminRepository.findAll();
    }

    public AdminMetricsResponse getMetrics() {
        long total = adminRepository.count();
        long superAdmins = adminRepository.countByRole(Role.SUPER_ADMIN);
        long regularAdmins = adminRepository.countByRole(Role.ADMIN);

        return new AdminMetricsResponse(total, superAdmins, regularAdmins);
    }

    @Transactional
    public AdminResponse createAdmin(CreateAdminRequest request,
            String currentAdminEmail) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists: " + request.getEmail());
        }

        Admin admin = new Admin();
        admin.setFullName(request.getFullName());
        admin.setEmail(request.getEmail());
        admin.setRole(request.getRole());
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        // Set default status if needed, e.g., admin.setStatus(AdminStatus.ACTIVE);

        Admin savedAdmin = adminRepository.save(admin);

        Long initiatorId = getAdminIdByEmail(currentAdminEmail);
        logAction(initiatorId, "CREATE_ADMIN", "admins", savedAdmin.getId(),
                "Created new admin: " + savedAdmin.getFullName());

        return mapToResponse(savedAdmin);
    }

    @Transactional

    public AdminResponse updateAdminEmail(Long adminId,
            UpdateAdminEmailRequest request,
            String currentAdminEmail) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with id: " + adminId));

        if (!admin.getEmail().equals(request.getEmail()) &&
                adminRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists: " + request.getEmail());
        }

        String oldEmail = admin.getEmail();
        admin.setEmail(request.getEmail());
        Admin updatedAdmin = adminRepository.save(admin);

        Long initiatorId = getAdminIdByEmail(currentAdminEmail);
        logAction(initiatorId, "UPDATE_ADMIN_EMAIL", "admins", adminId,
                "Updated email from " + oldEmail + " to " + request.getEmail());

        return mapToResponse(updatedAdmin);
    }

    // --- NEW METHOD ADDED HERE ---
    @Transactional
    public void updateAdminStatus(Long adminId, AdminStatus status) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with id: " + adminId));

        admin.setStatus(status);
        adminRepository.save(admin);

        // Fetch current user automatically for logging
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        adminRepository.findByEmail(currentEmail)
                .ifPresent(currentAdmin -> logAction(currentAdmin.getId(), "UPDATE_STATUS", "admins", adminId,
                        "Updated status to " + status));
    }
    // -----------------------------

    @Transactional
    public void deleteAdmin(Long adminId,
            String currentAdminEmail) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with id: " + adminId));

        Long initiatorId = getAdminIdByEmail(currentAdminEmail);

        if (adminId.equals(initiatorId)) {
            throw new IllegalArgumentException("Cannot delete your own account");
        }

        String adminName = admin.getFullName();
        adminRepository.delete(admin);

        logAction(initiatorId, "DELETE_ADMIN", "admins", adminId,
                "Deleted admin: " + adminName);
    }

    private void logAction(Long adminId, String actionType, String targetTable,
            Long targetId, String description) {
        AdminActionLog log = new AdminActionLog();

        Admin admin = adminRepository.getReferenceById(adminId);
        log.setAdmin(admin);

        log.setActionType(actionType);
        log.setTargetTable(targetTable);
        log.setTargetId(targetId);
        log.setDescription(description);
        actionLogRepository.save(log);
    }

    private AdminResponse mapToResponse(Admin admin) {
        return new AdminResponse(
                admin.getId(),
                admin.getFullName(),
                admin.getEmail(),
                admin.getRole(),
                admin.getCreatedAt());
    }

    public AdminProfileDTO getCurrentAdminProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return new AdminProfileDTO(
                admin.getFullName(),
                admin.getRole());
    }

    private Long getAdminIdByEmail(String email) {
        return adminRepository.findByEmail(email)
                .map(Admin::getId)
                .orElseThrow(() -> new AdminNotFoundException("Initiating admin not found: " + email));
    }
}