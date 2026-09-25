package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.AdminAppealRejectRequestDTO;
import com.findmymeds.backend.service.CivilianAppealAdminService;
import com.findmymeds.backend.dto.AdminAppealDetailsDTO;

import com.findmymeds.backend.service.CivilianAppealQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/appeals")
@RequiredArgsConstructor
public class AdminCivilianAppealController {

    private final CivilianAppealAdminService appealAdminService;
    private final CivilianAppealQueryService appealQueryService;

    @GetMapping
    public org.springframework.data.domain.Page<AdminAppealDetailsDTO> getAllAppeals(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @org.springframework.lang.NonNull org.springframework.data.domain.Pageable pageable) {
        return appealQueryService.getAllAppeals(status, search, pageable);
    }

    @GetMapping("/latest-by-civilian")
    public AdminAppealDetailsDTO getLatestAppeal(@RequestParam Long civilianId) {
        return appealQueryService.getLatestAppeal(civilianId);
    }

    @GetMapping("/{appealId}")
    public AdminAppealDetailsDTO getAppeal(@PathVariable Long appealId) {
        return appealQueryService.getAppealDetails(appealId);
    }

    @PostMapping("/{appealId}/approve")
    public void approve(@PathVariable Long appealId, @RequestParam Long adminId) {
        appealAdminService.approve(appealId, adminId);
    }

    @PostMapping("/{appealId}/reject")
    public void reject(@PathVariable Long appealId,
            @RequestParam Long adminId,
            @RequestBody AdminAppealRejectRequestDTO request) {
        appealAdminService.reject(appealId, adminId, request.getReason());
    }
}
