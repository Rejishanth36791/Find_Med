package com.findmymeds.backend.config;

import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CredentialFixer implements CommandLineRunner {

    private final PharmacyRepository pharmacyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- CREDENTIAL FIXER STARTED ---");
        fixPharmacy("pharmacy1@example.com", "password123");
        fixPharmacy("pharmacy2@example.com", "password123");
        System.out.println("--- CREDENTIAL FIXER FINISHED ---");
    }

    private void fixPharmacy(String email, String rawPassword) {
        Optional<Pharmacy> pharmacyOpt = pharmacyRepository.findByEmail(email);
        if (pharmacyOpt.isPresent()) {
            Pharmacy pharmacy = pharmacyOpt.get();
            String encoded = passwordEncoder.encode(rawPassword);
            pharmacy.setPasswordHash(encoded);
            // Ensure password field is also updated if it exists and is used (though
            // service uses passwordHash)
            pharmacy.setPassword(rawPassword);
            pharmacyRepository.save(pharmacy);
            System.out.println("Updated password for: " + email);
            System.out.println("New Hash: " + encoded);
        } else {
            System.out.println("Pharmacy not found: " + email);
        }
    }
}
