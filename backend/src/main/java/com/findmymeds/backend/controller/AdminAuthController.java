package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.*;
import com.findmymeds.backend.service.AdminAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {
    private final AdminAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}