package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.AdminCivilianVivoDTO;
import com.findmymeds.backend.service.CivilianVivoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/civilians")
@RequiredArgsConstructor
public class AdminCivilianVivoController {

    private final CivilianVivoService vivoService;

    @GetMapping("/{id}/vivo")
    public AdminCivilianVivoDTO getVivo(@PathVariable Long id) {
        return vivoService.getVivo(id);
    }

    @PostMapping("/{id}/vivo/disable-login")
    public void disableLogin(@PathVariable Long id, @RequestParam Long adminId) {
        vivoService.disableLogin(id, adminId);
    }

    @PostMapping("/{id}/vivo/anonymize")
    public void anonymize(@PathVariable Long id, @RequestParam Long adminId) {
        vivoService.anonymize(id, adminId);
    }
}
