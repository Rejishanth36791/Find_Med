package com.findmymeds.backend.service;

import com.findmymeds.backend.model.PharmacyProfile;
import com.findmymeds.backend.repository.AdminPharmacyProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminPharmacyProfileService {

    @Autowired
    private AdminPharmacyProfileRepository profileRepository;

    public Optional<PharmacyProfile> getProfileByPharmacyId(Long pharmacyId) {
        return profileRepository.findByPharmacyId(pharmacyId);
    }

    public PharmacyProfile saveProfile(@org.springframework.lang.NonNull PharmacyProfile profile) {
        return profileRepository.save(profile);
    }
}
