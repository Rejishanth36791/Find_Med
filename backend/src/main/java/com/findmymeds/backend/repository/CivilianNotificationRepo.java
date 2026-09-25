package com.findmymeds.backend.repository;

import com.findmymeds.backend.model.CivilianNotification;
import com.findmymeds.backend.model.enums.CivilianNotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CivilianNotificationRepo
                extends JpaRepository<CivilianNotification, Integer> {

        List<CivilianNotification> findByUserIdOrderByCreatedAtDesc(Integer userId);

        List<CivilianNotification> findByUserIdAndType(
                        Integer userId,
                        CivilianNotificationType type);

        List<CivilianNotification> findByUserIdAndIsRead(
                        Integer userId,
                        Boolean isRead);

        // Delete read notifications older than specified date
        @Modifying
        @Query("DELETE FROM CivilianNotification n WHERE n.isRead = true AND n.createdAt < :cutoffDate")
        int deleteReadNotificationsOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);

}
