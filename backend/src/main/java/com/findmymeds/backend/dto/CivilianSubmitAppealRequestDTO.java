package com.findmymeds.backend.dto;

import lombok.Data;

@Data
public class CivilianSubmitAppealRequestDTO {
    private String appealReason;
    private String attachment; // path or URL
}
