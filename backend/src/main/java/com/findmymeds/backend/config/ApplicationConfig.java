package com.findmymeds.backend.config;

import com.findmymeds.backend.repository.AdminRepository;
import com.findmymeds.backend.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final AdminRepository adminRepository;
    private final PharmacyRepository pharmacyRepository;
    private final com.findmymeds.backend.repository.CivilianRepository civilianRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            var admin = adminRepository.findByEmail(username);
            if (admin.isPresent()) {
                return new AdminUserDetails(admin.get());
            }

            var pharmacy = pharmacyRepository.findByEmail(username);
            if (pharmacy.isPresent()) {
                return new PharmacyUserDetails(pharmacy.get());
            }

            var civilian = civilianRepository.findByEmail(username);
            if (civilian.isPresent()) {
                return new CivilianUserDetails(civilian.get());
            }

            throw new UsernameNotFoundException("User not found");
        };
    }

    @Bean
    @SuppressWarnings("deprecation")
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}