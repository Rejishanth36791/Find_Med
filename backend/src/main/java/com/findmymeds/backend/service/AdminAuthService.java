package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.*;
import com.findmymeds.backend.model.Admin;
import com.findmymeds.backend.model.enums.AdminStatus;
import com.findmymeds.backend.repository.AdminRepository;
import com.findmymeds.backend.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminAuthService {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminLoginResponse login(AdminLoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getStatus() != AdminStatus.ACTIVE) {
            throw new RuntimeException("Account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", admin.getRole().name());
        claims.put("adminId", admin.getId());

        String token = jwtService.generateToken(admin.getEmail(), claims);
        return new AdminLoginResponse(token, admin.getFullName(), admin.getRole().name());
    }
}