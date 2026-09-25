package com.findmymeds.backend.config;

import com.findmymeds.backend.model.Admin;
import com.findmymeds.backend.model.enums.AdminStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class AdminUserDetails implements UserDetails {

    private final Admin admin;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert Role enum to Spring Security authority
        return List.of(new SimpleGrantedAuthority("ROLE_" + admin.getRole().name()));
    }

    @Override
    public String getPassword() {
        return admin.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return admin.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return admin.getStatus() != AdminStatus.DEACTIVATED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return admin.getStatus() == com.findmymeds.backend.model.enums.AdminStatus.ACTIVE;
    }

    // Helper method to get the original Admin object if needed
    public Admin getAdmin() {
        return admin;
    }
}