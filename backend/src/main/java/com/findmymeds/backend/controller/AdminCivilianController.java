package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.AdminCivilianDetailsDTO;
import com.findmymeds.backend.dto.AdminCivilianMetricCardDTO;
import com.findmymeds.backend.dto.AdminCivilianTableRowDTO;
import com.findmymeds.backend.dto.AdminPermanentBanRequestDTO;
import com.findmymeds.backend.dto.AdminCivilianTempBanRequestDTO;
import com.findmymeds.backend.model.enums.AccountStatus;
import com.findmymeds.backend.service.CivilianBanService;
import com.findmymeds.backend.service.CivilianQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/civilians")
@RequiredArgsConstructor
public class AdminCivilianController {

    private final CivilianQueryService queryService;
    private final CivilianBanService banService;

    @GetMapping("/metrics")
    public AdminCivilianMetricCardDTO metrics() {
        return queryService.getMetrics();
    }

    @GetMapping
    public Page<AdminCivilianTableRowDTO> list(
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return queryService.getTable(status, search, pageable);
    }

    @GetMapping("/{id}")
    public AdminCivilianDetailsDTO details(@PathVariable Long id) {
        return queryService.getDetails(id);
    }

    @PostMapping("/{id}/temp-ban")
    public void tempBan(@PathVariable Long id,
            @RequestBody AdminCivilianTempBanRequestDTO req,
            @RequestParam Long adminId) {
        banService.tempBan(id, req.getReason(), adminId);
    }

    @PostMapping("/{id}/permanent-ban")
    public void permanentBan(@PathVariable Long id,
            @RequestBody AdminPermanentBanRequestDTO req,
            @RequestParam Long adminId) {
        banService.permanentBan(id, req.getReason(), adminId);
    }
}
