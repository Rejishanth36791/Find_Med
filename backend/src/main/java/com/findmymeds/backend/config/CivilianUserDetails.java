package com.findmymeds.backend.config;

import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.enums.AccountStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class CivilianUserDetails implements UserDetails {

    private final Civilian civilian;

    public Civilian getCivilian() {
        return civilian;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_CIVILIAN"));
    }

    @Override
    public String getPassword() {
        return civilian.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return civilian.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return civilian.getAccountStatus() != AccountStatus.PERMANENT_BANNED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !civilian.getIsLoginDisabled();
    }
}
