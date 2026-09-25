package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.enums.NotificationType;
import com.findmymeds.backend.model.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.findmymeds.backend.model.Notification;
import com.findmymeds.backend.model.enums.UserType;
import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdAndUserTypeOrderByCreatedAtDesc(Long userId, UserType userType);

    // Pharmacy specific methods (Added in HEAD)
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.userType = 'PHARMACY'")
    Page<Notification> findByPharmacyId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.userType = 'PHARMACY' AND n.read = false AND n.notificationType IN :types")
    long countUnreadByTypes(@Param("userId") Long userId, @Param("types") List<NotificationType> types);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.userType = 'PHARMACY' AND n.read = false")
    long countUnreadByPharmacy(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.userType = 'PHARMACY' AND n.read = false")
    List<Notification> findAllUnreadByPharmacy(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.userId = :userId AND n.userType = 'PHARMACY'")
    void deleteAllByPharmacy(@Param("userId") Long userId);

    // Existing methods from master
    List<Notification> findByTargetRoleOrderByCreatedAtDesc(Role role);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.read = true AND n.readAt < :cutoff")
    void deleteOldReadNotifications(@Param("cutoff") LocalDateTime cutoff);

    long countByTargetRoleAndReadTrue(Role targetRole);

    long countByTargetRoleAndReadFalse(Role targetRole);

    List<Notification> findTop2ByTargetRoleAndReadFalseOrderByCreatedAtDesc(Role targetRole);

    Page<Notification> findByTargetRoleOrderByCreatedAtDesc(Role targetRole, Pageable pageable);

    Page<Notification> findByTargetRoleAndReadFalseOrderByCreatedAtDesc(Role targetRole, Pageable pageable);

}
