package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.CivilianSubmitAppealRequestDTO;
import com.findmymeds.backend.model.CivilianAppeal;
import com.findmymeds.backend.service.CivilianAppealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/civilian/appeals")
@RequiredArgsConstructor
public class CivilianAppealController {

    private final CivilianAppealService appealService;

    @PostMapping
    public CivilianAppeal submit(@RequestParam Long civilianId,
                                 @RequestBody CivilianSubmitAppealRequestDTO req) {
        return appealService.submitAppeal(civilianId, req.getAppealReason(), req.getAttachment());
    }
}
