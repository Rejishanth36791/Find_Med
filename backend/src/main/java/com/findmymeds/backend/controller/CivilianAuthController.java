package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.AuthenticationResponse;
import com.findmymeds.backend.dto.LoginRequest;
import com.findmymeds.backend.service.CivilianAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/civilian/auth")
@RequiredArgsConstructor
public class CivilianAuthController {

    private final CivilianAuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody com.findmymeds.backend.dto.CivilianSignupRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody LoginRequest request) {
        return ResponseEntity.ok(service.login(request));
    }
}
