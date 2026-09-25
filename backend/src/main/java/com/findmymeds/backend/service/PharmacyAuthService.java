package com.findmymeds.backend.service;

import com.findmymeds.backend.config.PharmacyUserDetails;
import com.findmymeds.backend.config.JwtService;
import com.findmymeds.backend.dto.PharmacyLoginRequestDto;
import com.findmymeds.backend.dto.PharmacySignupRequest;
import com.findmymeds.backend.dto.AuthenticationResponse;
import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PharmacyAuthService {

    private final PharmacyRepository pharmacyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationResponse register(PharmacySignupRequest request) {
        if (pharmacyRepository.findByLicenseNumber(request.getLicenseNumber()).isPresent()) {
            throw new RuntimeException("License number already registered");
        }
        if (pharmacyRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        var pharmacy = new Pharmacy();
        pharmacy.setName(request.getName());
        pharmacy.setOwnerName(request.getOwnerName());
        pharmacy.setLicenseNumber(request.getLicenseNumber());
        pharmacy.setEmail(request.getEmail());
        pharmacy.setPhone(request.getPhone());
        pharmacy.setAddress(request.getAddress());
        pharmacy.setDistrict(request.getDistrict());
        pharmacy.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        pharmacy.setStatus(com.findmymeds.backend.model.enums.PharmacyStatus.PENDING); // Default status
        pharmacy.setCreatedAt(java.time.LocalDateTime.now());
        pharmacy.setPharmacyType(com.findmymeds.backend.model.enums.PharmacyType.RETAIL); // Default type or can be
                                                                                          // added to request

        pharmacyRepository.save(pharmacy);

        // Auto-login after registration or return explicit message?
        // Let's return token for auto-login
        var userDetails = new PharmacyUserDetails(pharmacy);
        var token = jwtService.generateToken(userDetails);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    public AuthenticationResponse login(PharmacyLoginRequestDto request) {
        System.out.println("Login attempt for: " + request.getEmail());
        try {
            Pharmacy pharmacy = pharmacyRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("Pharmacy not found"));
            System.out.println("Pharmacy found: " + pharmacy.getId());

            if (!passwordEncoder.matches(request.getPassword(), pharmacy.getPasswordHash())) {
                System.out.println("Password mismatch");
                throw new BadCredentialsException("Invalid password");
            }
            System.out.println("Password matched");

            PharmacyUserDetails userDetails = new PharmacyUserDetails(pharmacy);
            System.out.println("UserDetails created: " + userDetails.getUsername());

            String token = jwtService.generateToken(userDetails);
            System.out.println("Token generated");

            return AuthenticationResponse.builder()
                    .token(token)
                    .build();
        } catch (Exception e) {
            System.err.println("Exception in login service: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
