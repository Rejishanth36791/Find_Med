package com.findmymeds.backend.service;

import com.findmymeds.backend.config.CivilianUserDetails;
import com.findmymeds.backend.config.JwtService;
import com.findmymeds.backend.dto.LoginRequest; // Assuming generic LoginRequest or create new one
import com.findmymeds.backend.dto.AuthenticationResponse; // Reuse or create new
import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.DuplicateEmailException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.findmymeds.backend.repository.CivilianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CivilianAuthService {

    private final CivilianRepository civilianRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationResponse register(com.findmymeds.backend.dto.CivilianSignupRequest request) { // Use DTO
        if (civilianRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateEmailException("Email already taken");
        }
        // Check NIC?
        if (civilianRepository.findByNicNumber(request.getNicNumber()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "NIC already registered");
        }

        var civilian = new Civilian();
        civilian.setFullName(request.getFullName());
        civilian.setEmail(request.getEmail());
        civilian.setPhone(request.getPhone());
        civilian.setNicNumber(request.getNicNumber());
        civilian.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        civilian.setAccountStatus(com.findmymeds.backend.model.enums.AccountStatus.ACTIVE);
        civilian.setCreatedAt(java.time.LocalDateTime.now());

        // Generate masked fields
        civilian.setMaskedEmail(maskEmail(request.getEmail()));
        civilian.setMaskedName(maskName(request.getFullName()));

        try {
            civilianRepository.save(civilian);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Account already exists (Email or NIC collision)");
        }

        CivilianUserDetails userDetails = new CivilianUserDetails(civilian);
        String token = jwtService.generateToken(userDetails);

        var civilianDTO = new com.findmymeds.backend.dto.CivilianDTO();
        civilianDTO.setId(civilian.getId());
        civilianDTO.setName(civilian.getFullName());
        civilianDTO.setEmail(civilian.getEmail());
        civilianDTO.setPhone(civilian.getPhone());
        civilianDTO.setAccountStatus(civilian.getAccountStatus());
        civilianDTO.setBanReason(civilian.getBanReason());
        civilianDTO.setBanDate(civilian.getBanDate());

        return AuthenticationResponse.builder()
                .token(token)
                .id(civilian.getId())
                .name(civilian.getFullName())
                .email(civilian.getEmail())
                .role("CIVILIAN")
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        Civilian civilian = civilianRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Civilian not found"));

        if (!passwordEncoder.matches(request.getPassword(), civilian.getPasswordHash())) {
            throw new BadCredentialsException("Invalid password");
        }

        CivilianUserDetails userDetails = new CivilianUserDetails(civilian);
        String token = jwtService.generateToken(userDetails);

        var civilianDTO = new com.findmymeds.backend.dto.CivilianDTO();
        civilianDTO.setId(civilian.getId());
        civilianDTO.setName(civilian.getFullName());
        civilianDTO.setEmail(civilian.getEmail());
        civilianDTO.setPhone(civilian.getPhone());
        civilianDTO.setAccountStatus(civilian.getAccountStatus());
        civilianDTO.setBanReason(civilian.getBanReason());
        civilianDTO.setBanDate(civilian.getBanDate());

        return AuthenticationResponse.builder()
                .token(token)
                .id(civilian.getId())
                .name(civilian.getFullName())
                .email(civilian.getEmail())
                .role("CIVILIAN")
                .build();
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@"))
            return email;
        int atIndex = email.indexOf("@");
        if (atIndex <= 2)
            return email;
        return email.substring(0, 2) + "***" + email.substring(atIndex);
    }

    private String maskName(String name) {
        if (name == null || name.length() <= 2)
            return name;
        return name.substring(0, 2) + "*** " + name.substring(name.lastIndexOf(" ") + 1).substring(0,
                Math.min(2, name.substring(name.lastIndexOf(" ") + 1).length())) + "***";
    }
}
