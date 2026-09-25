package com.findmymeds.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:5175",
                        "http://localhost:5176", "http://localhost:5179"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        // 0. RELAXED SECURITY FOR TESTING (User Request)
                        .requestMatchers("/**").permitAll()

                        // 1. Public Endpoints (Authentication & Public Pharmacy Search)
                        .requestMatchers("/api/auth/**", "/api/v1/admin/auth/**").permitAll()
                        .requestMatchers("/api/v1/civilian/auth/**").permitAll()
                        .requestMatchers("/api/civilian/medicine/**").permitAll()
                        .requestMatchers("/api/v1/pharmacy/auth/login", "/api/v1/pharmacy/auth/signup").permitAll()
                        .requestMatchers("/api/v1/pharmacy/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pharmacies/**").permitAll()
                        .requestMatchers("/api/pharmacy/**", "/api/notifications/**").permitAll()
                        .requestMatchers("/api/v1/pharmacy/**").permitAll()

                        // 2. Super Admin Only Endpoints
                        .requestMatchers("/api/admin/dashboard/overview/super").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/admin/dashboard/charts/admins").hasRole("SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/admins/**").hasRole("SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/admins/**").hasRole("SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/admins/**").hasRole("SUPER_ADMIN")

                        // 3. Admin & Super Admin Endpoints
                        .requestMatchers("/api/admin/pharmacy-reports/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/admin/pharmacy-inventories/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/admin/pharmacies/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/admin/dashboard/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/admin-reports/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/admin/notifications/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                        // 4. Authenticated User Endpoints
                        .requestMatchers("/api/profile/**").authenticated()

                        // 5. All other requests must be authenticated
                        .anyRequest().authenticated());

        return http.build();
    }
}
