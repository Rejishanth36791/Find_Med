package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.CivilianDTO;
import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.repository.CivilianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/civilian/profile")
@RequiredArgsConstructor
public class CivilianProfileController {

    private final CivilianRepository civilianRepository;

    @GetMapping
    public ResponseEntity<CivilianDTO> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = null;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            email = ((UserDetails) authentication.getPrincipal()).getUsername();
        } else if (authentication != null) {
            email = authentication.getName();
        }

        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        Civilian civilian = civilianRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Civilian not found"));

        CivilianDTO dto = new CivilianDTO();
        dto.setId(civilian.getId());
        dto.setName(civilian.getFullName());
        dto.setEmail(civilian.getEmail());
        dto.setPhone(civilian.getPhone());
        dto.setAccountStatus(civilian.getAccountStatus());
        dto.setBanReason(civilian.getBanReason());
        dto.setBanDate(civilian.getBanDate());

        // Calculate remaining days for appeal if banned
        if (civilian.getBanDate() != null) {
            // Logic can be added here or in DTO if needed, but for now strict DTO mapping
        }

        return ResponseEntity.ok(dto);
    }
}
