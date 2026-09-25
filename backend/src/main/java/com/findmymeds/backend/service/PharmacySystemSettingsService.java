package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.SystemSettingsDto;
import com.findmymeds.backend.model.PharmacySystemSettings;
import com.findmymeds.backend.repository.PharmacyRepository;
import com.findmymeds.backend.repository.PharmacySystemSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PharmacySystemSettingsService {

    private final PharmacySystemSettingsRepository settingsRepository;
    private final PharmacyRepository pharmacyRepository;

    public SystemSettingsDto getSettings(Long pharmacyId) {
        PharmacySystemSettings settings = settingsRepository.findByPharmacyId(pharmacyId)
                .orElseGet(() -> createDefaultSettings(pharmacyId));

        return mapToDto(settings);
    }

    public void saveSettings(Long pharmacyId, SystemSettingsDto dto) {
        PharmacySystemSettings settings = settingsRepository.findByPharmacyId(pharmacyId)
                .orElseGet(() -> {
                    PharmacySystemSettings s = new PharmacySystemSettings();
                    s.setPharmacy(pharmacyRepository.getReferenceById(java.util.Objects.requireNonNull(pharmacyId)));
                    return s;
                });

        updateEntityFromDto(settings, dto);
        settingsRepository.save(java.util.Objects.requireNonNull(settings));
    }

    private PharmacySystemSettings createDefaultSettings(Long pharmacyId) {
        PharmacySystemSettings settings = new PharmacySystemSettings();
        settings.setPharmacy(pharmacyRepository.getReferenceById(java.util.Objects.requireNonNull(pharmacyId)));
        return settingsRepository.save(settings);
    }

    private SystemSettingsDto mapToDto(PharmacySystemSettings settings) {
        return new SystemSettingsDto(
                settings.isNotificationsEnabled(),
                settings.getTheme(),
                settings.getDefaultHomepage(),
                settings.isInventoryAlerts(),
                settings.isExpiryAlerts(),
                settings.isSystemMessages());
    }

    private void updateEntityFromDto(PharmacySystemSettings entity, SystemSettingsDto dto) {
        entity.setNotificationsEnabled(dto.isNotificationsEnabled());
        entity.setTheme(dto.getTheme());
        entity.setDefaultHomepage(dto.getDefaultHomepage());
        entity.setInventoryAlerts(dto.isInventoryAlerts());
        entity.setExpiryAlerts(dto.isExpiryAlerts());
        entity.setSystemMessages(dto.isSystemMessages());
    }
}
