package com.findmymeds.backend.config;

import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.model.enums.PharmacyStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class PharmacyUserDetails implements UserDetails {
    // Custom UserDetails implementation for Pharmacy

    private final Pharmacy pharmacy;

    public Pharmacy getPharmacy() {
        return pharmacy;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_PHARMACY"));
    }

    @Override
    public String getPassword() {
        return pharmacy.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return pharmacy.getLicenseNumber(); // Uses License Number as username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return pharmacy.getStatus() != PharmacyStatus.REJECTED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return (pharmacy.getStatus() == PharmacyStatus.ACTIVE || pharmacy.getStatus() == PharmacyStatus.APPROVED)
                && !Boolean.TRUE.equals(pharmacy.getIsDeleted());
    }
}
