package com.findmymeds.backend.service;

import com.findmymeds.backend.model.*;
import com.findmymeds.backend.model.enums.ReservationStatus;
import com.findmymeds.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.findmymeds.backend.dto.ActivityResponse;
import com.findmymeds.backend.dto.ActivityResponse.ActivityReservationDTO;
import com.findmymeds.backend.dto.ReservationDetailDTO;
import java.util.Arrays;
import java.util.Optional;

@Service
public class CivilianReservationService {

        @Autowired
        private MedicineRepository medicineRepository;

        @Autowired
        private PharmacyInventoryRepository pharmacyInventoryRepository;

        @Autowired
        private PharmacyRepository pharmacyRepository;

        @Autowired
        private CivilianRepository civilianRepository;

        @Autowired
        private NotificationRepository notificationRepository;

        @Autowired
        private ReservationRepository reservationRepository;

        // Step 1: Search Medicines
        public List<Medicine> searchMedicines(String name) {
                return medicineRepository.findByMedicineNameContainingIgnoreCaseAndStatusAndRemovedFalse(name,
                                Medicine.MedicineStatus.ACTIVE);
        }

        // Step 3: Recommend Pharmacies
        public List<Map<String, Object>> recommendPharmacies(Long medicineId, Integer quantity, Double userLat,
                        Double userLng) {
                List<PharmacyInventory> inventoryList = pharmacyInventoryRepository.findPharmaciesWithStock(medicineId,
                                quantity);

                return inventoryList.stream().map(inv -> {
                        Pharmacy p = inv.getPharmacy();
                        Map<String, Object> map = new java.util.HashMap<>();
                        map.put("pharmacyId", p.getId());
                        map.put("pharmacyName", p.getName());
                        map.put("availableQuantity", inv.getAvailableQuantity());
                        map.put("location", p.getDistrict() != null ? p.getDistrict() : "Unknown");
                        map.put("latitude", p.getLatitude() != null ? p.getLatitude() : 0.0);
                        map.put("longitude", p.getLongitude() != null ? p.getLongitude() : 0.0);
                        map.put("price", inv.getPrice());

                        // Calculate Distance if user location is provided
                        if (userLat != null && userLng != null && p.getLatitude() != null && p.getLongitude() != null) {
                                double distance = calculateDistance(userLat, userLng, p.getLatitude(),
                                                p.getLongitude());
                                map.put("distance", distance);
                        } else {
                                map.put("distance", null);
                        }

                        return map;
                })
                                .sorted((m1, m2) -> {
                                        Double d1 = (Double) m1.get("distance");
                                        Double d2 = (Double) m2.get("distance");
                                        if (d1 == null && d2 == null)
                                                return 0;
                                        if (d1 == null)
                                                return 1;
                                        if (d2 == null)
                                                return -1;
                                        return d1.compareTo(d2);
                                })
                                .collect(Collectors.toList());
        }

        private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
                final int R = 6371; // Radius of the earth in km
                double latDistance = Math.toRadians(lat2 - lat1);
                double lonDistance = Math.toRadians(lon2 - lon1);
                double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                                                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
                double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                double distance = R * c;
                return Math.round(distance * 10.0) / 10.0; // Round to 1 decimal place
        }

        public Map<String, Object> getDashboardStats(Long civilianId) {
                Map<String, Object> stats = new java.util.HashMap<>();
                // Pharmacies Nearby (For now, just count all active pharmacies)
                long pharmaciesCount = pharmacyRepository.count();
                stats.put("pharmaciesNearby", pharmaciesCount);

                // My Inquiries (Pending) - Placeholder for now
                stats.put("pendingInquiries", 0);

                // Notifications (Unread provided by NotificationRepository or derived)
                // For simplicity, we can fetch all and filter or add a count method.
                // Let's just return a mock count if the repo method isn't ready, but we added
                // one.
                // Actually, let's use the repo to count unread if possible, or just return 0 if
                // not Critical.
                // The NotificationRepository has countUnreadByTypes but that is for Pharmacy.
                // We will just use 0 for now or fetch all.
                stats.put("activeReservations",
                                reservationRepository.countByCivilianIdAndStatus(civilianId,
                                                ReservationStatus.PENDING));

                return stats;
        }

        public List<Notification> getNotifications(Long civilianId) {
                return notificationRepository.findByUserIdAndUserTypeOrderByCreatedAtDesc(civilianId,
                                com.findmymeds.backend.model.enums.UserType.CIVILIAN);
        }

        // Step 5: Confirm Reservation
        @Transactional
        public Reservation confirmReservation(@org.springframework.lang.NonNull Long civilianId,
                        @org.springframework.lang.NonNull Long medicineId,
                        @org.springframework.lang.NonNull Long pharmacyId,
                        Integer quantity,
                        LocalDate pickupDate, String notes, String prescriptionFile) {
                // 1. Validate Civilian
                System.out.println("confirmReservation for CivilianID: " + civilianId);
                Civilian civilian = civilianRepository.findById(civilianId)
                                .orElseThrow(() -> new RuntimeException("Civilian not found"));

                // 2. Validate Pharmacy and Medicine
                Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

                Medicine medicine = medicineRepository.findById(medicineId)
                                .orElseThrow(() -> new RuntimeException("Medicine not found"));

                // 3. Re-check Inventory
                PharmacyInventory inventory = pharmacyInventoryRepository
                                .findByPharmacyIdAndMedicineId(pharmacyId, medicineId)
                                .orElseThrow(() -> new RuntimeException("Medicine not available at this pharmacy"));

                if (inventory.getAvailableQuantity() < quantity) {
                        throw new RuntimeException("Insufficient quantity available");
                }

                // 4. Create Reservation
                Reservation reservation = new Reservation();
                reservation.setCivilian(civilian);
                reservation.setPharmacy(pharmacy);
                reservation.setMedicine(medicine);
                reservation.setQuantity(quantity);
                reservation.setPickupDate(pickupDate);
                reservation.setNote(notes);
                reservation.setPrescriptionImageUrl(prescriptionFile); // Assuming URL/Path for now
                reservation.setStatus(ReservationStatus.PENDING);
                reservation.setCreatedAt(LocalDateTime.now());
                reservation.setReservationDate(LocalDateTime.now()); // Ensure this is set
                reservation.setExpiryDate(pickupDate.plusDays(2)); // Default 2 days expiry
                reservation.setReservationCode("RES-" + System.currentTimeMillis());

                reservationRepository.save(reservation);

                // 5. Soft Lock Inventory (Deduct)
                inventory.setAvailableQuantity(inventory.getAvailableQuantity() - quantity);
                pharmacyInventoryRepository.save(inventory);

                return reservation;
        }

        // Existing methods (keep them working)
        public Reservation createReservation(@org.springframework.lang.NonNull Reservation reservation) {
                return reservationRepository.save(reservation);
        }

        public List<Reservation> getAllReservations() {
                return reservationRepository.findAll();
        }

        public List<Reservation> getReservationsByCivilian(Long civilianId) {
                return reservationRepository.findByCivilianIdOrderByReservationDateDesc(civilianId);
        }

        // New methods for Activity Page

        public ActivityResponse getActivity(Long civilianId) {
                try {
                        List<ReservationStatus> activeStatuses = Arrays.asList(
                                        ReservationStatus.PENDING,
                                        ReservationStatus.CONFIRMED,
                                        ReservationStatus.ONGOING,
                                        ReservationStatus.READY);
                        List<Reservation> active = reservationRepository.findByCivilianIdAndStatusIn(civilianId,
                                        activeStatuses);
                        System.out.println("getActivity for CivilianID: " + civilianId);
                        System.out.println("Active Reservations Found: " + active.size());

                        List<ReservationStatus> historyStatusesFiltered = Arrays.asList(
                                        ReservationStatus.COLLECTED,
                                        ReservationStatus.CANCELLED,
                                        ReservationStatus.EXPIRED,
                                        ReservationStatus.UNCOLLECTED);

                        List<Reservation> history = reservationRepository.findHistoryByCivilianIdAndStatusIn(civilianId,
                                        historyStatusesFiltered);
                        System.out.println("History Reservations Found: " + history.size());

                        return ActivityResponse.builder()
                                        .activeReservations(active.stream().map(this::mapToActivityDTO)
                                                        .collect(Collectors.toList()))
                                        .reservationHistory(history.stream().map(this::mapToActivityDTO)
                                                        .collect(Collectors.toList()))
                                        .build();
                } catch (Exception e) {
                        e.printStackTrace(); // Log error to console
                        throw e; // Rethrow to maintain 500 behavior but now we have logs
                }
        }

        private ActivityReservationDTO mapToActivityDTO(Reservation r) {
                return ActivityReservationDTO.builder()
                                .reservationId(r.getId())
                                .medicineName(r.getMedicine() != null ? r.getMedicine().getMedicineName() : "Unknown")
                                .pharmacyName(r.getPharmacy() != null ? r.getPharmacy().getName() : "Unknown")
                                .quantity(r.getQuantity())
                                .reservationDate(r.getReservationDate() != null ? r.getReservationDate().toLocalDate()
                                                : null)
                                .expiryDate(r.getExpiryDate())
                                .completedDate(r.getPickupDate()) // Using pickupDate as completed/expected date
                                .status(r.getStatus())
                                .build();
        }

        public ReservationDetailDTO getReservationDetails(@org.springframework.lang.NonNull Long reservationId,
                        @org.springframework.lang.NonNull Long civilianId) {
                Reservation r = reservationRepository.findById(reservationId)
                                .orElseThrow(() -> new RuntimeException("Reservation not found"));

                if (!r.getCivilian().getId().equals(civilianId)) {
                        throw new RuntimeException("Unauthorized access to reservation");
                }

                return ReservationDetailDTO.builder()
                                .reservationId(r.getId())
                                .medicine(ReservationDetailDTO.MedicineInfo.builder()
                                                .name(r.getMedicine() != null ? r.getMedicine().getMedicineName()
                                                                : "Unknown")
                                                .genericName(r.getMedicine() != null ? r.getMedicine().getGenericName()
                                                                : "Unknown")
                                                .category(r.getMedicine() != null && r.getMedicine().getType() != null
                                                                ? r.getMedicine().getType().name()
                                                                : "Unknown")
                                                .prescriptionRequired(r.getMedicine() != null
                                                                && r.getMedicine().isRequiresPrescription())
                                                .quantity(r.getQuantity())
                                                .build())
                                .pharmacy(ReservationDetailDTO.PharmacyInfo.builder()
                                                .name(r.getPharmacy() != null ? r.getPharmacy().getName() : "Unknown")
                                                .location(r.getPharmacy() != null ? r.getPharmacy().getDistrict()
                                                                : "Unknown") // Using district
                                                                             // as location
                                                .contact(r.getPharmacy() != null ? r.getPharmacy().getPhone()
                                                                : "Unknown")
                                                .build())
                                .reservationDetails(ReservationDetailDTO.ReservationInfo.builder()
                                                .pickupDate(r.getPickupDate())
                                                .prescriptionFile(r.getPrescriptionImageUrl())
                                                .notes(r.getNote())
                                                .status(r.getStatus())
                                                .timeframe(r.getTimeframe())
                                                .build())
                                .billing(ReservationDetailDTO.BillingInfo.builder()
                                                .unitPrice(0.0) // Not stored in Reservation currently, placeholder
                                                .total(r.getTotalAmount())
                                                .grandTotal(r.getTotalAmount())
                                                .build())
                                .build();
        }

        @Transactional
        public void cancelReservation(@org.springframework.lang.NonNull Long reservationId,
                        @org.springframework.lang.NonNull Long civilianId) {
                Reservation r = reservationRepository.findById(reservationId)
                                .orElseThrow(() -> new RuntimeException("Reservation not found"));

                if (!r.getCivilian().getId().equals(civilianId)) {
                        throw new RuntimeException("Unauthorized action");
                }

                if (r.getStatus() != ReservationStatus.PENDING && r.getStatus() != ReservationStatus.CONFIRMED
                                && r.getStatus() != ReservationStatus.ONGOING) {
                        throw new RuntimeException("Cannot cancel reservation in current status: " + r.getStatus());
                }

                r.setStatus(ReservationStatus.CANCELLED);
                reservationRepository.save(r);

                // Restore inventory
                Optional<PharmacyInventory> inventoryOpt = pharmacyInventoryRepository
                                .findByPharmacyIdAndMedicineId(r.getPharmacy().getId(), r.getMedicine().getId());
                if (inventoryOpt.isPresent()) {
                        PharmacyInventory inventory = inventoryOpt.get();
                        inventory.setAvailableQuantity(inventory.getAvailableQuantity() + r.getQuantity());
                        pharmacyInventoryRepository.save(inventory);
                }
        }
}
