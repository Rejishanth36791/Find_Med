package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SystemSettingsDto {
    private boolean notificationsEnabled;
    private String theme; // "Light" or "Dark"
    private String defaultHomepage;
    private boolean inventoryAlerts;
    private boolean expiryAlerts;
    private boolean systemMessages;
}
