package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.AuthenticationResponse;
import com.findmymeds.backend.dto.PharmacyLoginRequestDto;
import com.findmymeds.backend.service.PharmacyAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/pharmacy/auth")
@RequiredArgsConstructor
public class PharmacyAuthController {

    private final PharmacyAuthService service;

    @PostMapping("/signup")
    public ResponseEntity<AuthenticationResponse> signup(
            @RequestBody com.findmymeds.backend.dto.PharmacySignupRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody PharmacyLoginRequestDto request) {
        try {
            return ResponseEntity.ok(service.login(request));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
