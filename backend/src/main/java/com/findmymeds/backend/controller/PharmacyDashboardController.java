package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.DashboardMetricsDto;
import com.findmymeds.backend.service.PharmacyDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.findmymeds.backend.config.PharmacyUserDetails;
import com.findmymeds.backend.model.PharmacyActivityLog;
import com.findmymeds.backend.repository.PharmacyActivityLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PHARMACY')")
public class PharmacyDashboardController {

    private final PharmacyDashboardService pharmacyDashboardService;
    private final PharmacyActivityLogRepository activityLogRepository;

    private Long getCurrentPharmacyId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof PharmacyUserDetails) {
            return ((PharmacyUserDetails) auth.getPrincipal()).getPharmacy().getId();
        }
        throw new RuntimeException("Unauthorized: User is not a pharmacy");
    }

    @GetMapping("/dashboard/metrics")
    public ResponseEntity<DashboardMetricsDto> getMetrics() {
        return ResponseEntity.ok(pharmacyDashboardService.getMetrics(getCurrentPharmacyId()));
    }

    @GetMapping("/activities/recent")
    public ResponseEntity<List<Map<String, String>>> getRecentActivities() {
        List<PharmacyActivityLog> logs = activityLogRepository.findByPharmacyIdOrderByTimestampDesc(
                getCurrentPharmacyId(),
                PageRequest.of(0, 5));

        List<Map<String, String>> response = logs.stream().map(log -> Map.of(
                "userName", "System", // Or fetch user if needed
                "action", log.getAction(),
                "detail", log.getDetail() != null ? log.getDetail() : "",
                "timeAgo", calculateTimeAgo(log.getTimestamp()),
                "type", log.getType().toString().toLowerCase(),
                "link", log.getLink() != null ? log.getLink() : "/pharmacy/dashboard")).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private String calculateTimeAgo(java.time.LocalDateTime timestamp) {
        java.time.Duration duration = java.time.Duration.between(timestamp, java.time.LocalDateTime.now());
        long minutes = duration.toMinutes();
        if (minutes < 1)
            return "Just now";
        if (minutes < 60)
            return minutes + "m ago";
        long hours = duration.toHours();
        if (hours < 24)
            return hours + "h ago";
        return duration.toDays() + "d ago";
    }
}
