package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.MedicineDetailDTO;
import com.findmymeds.backend.dto.MedicineInventoryDTO;
import com.findmymeds.backend.dto.MedicineInventoryMetricsDTO;
import com.findmymeds.backend.model.Medicine;
import com.findmymeds.backend.model.PharmacyInventory;
import com.findmymeds.backend.model.enums.NotificationType;
import com.findmymeds.backend.model.enums.Priority;
import com.findmymeds.backend.model.enums.UserType;
import com.findmymeds.backend.repository.MedicineRepository;
import com.findmymeds.backend.repository.PharmacyInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.findmymeds.backend.config.PharmacyUserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PharmacyMedicineInventoryService {

    private final PharmacyInventoryRepository inventoryRepository;
    private final MedicineRepository medicineRepository;
    private final PharmacyNotificationService notificationService;

    private Long getCurrentPharmacyId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof PharmacyUserDetails) {
            return ((PharmacyUserDetails) auth.getPrincipal()).getPharmacy().getId();
        }
        throw new RuntimeException("Unauthorized: Pharmacy access required");
    }

    public MedicineInventoryMetricsDTO getInventoryMetrics() {
        Long pharmacyId = getCurrentPharmacyId();
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate thirtyDaysLater = today.plusDays(30);

        return MedicineInventoryMetricsDTO.builder()
                .totalMedicines(inventoryRepository.countByPharmacyId(pharmacyId))
                .inStock(inventoryRepository.countInStock(pharmacyId, thirtyDaysLater))
                .lowStock(inventoryRepository.countLowStock(pharmacyId, thirtyDaysLater))
                .outOfStock(inventoryRepository.countOutOfStock(pharmacyId, thirtyDaysLater))
                .expired(inventoryRepository.countExpired(pharmacyId, today))
                .expiringSoon(inventoryRepository.countExpiringSoon(pharmacyId, today, thirtyDaysLater))
                .deactivated(inventoryRepository.countDeactivated(pharmacyId))
                .build();
    }

    public Page<MedicineInventoryDTO> getInventory(String filter, String search, int page, int size) {
        Long pharmacyId = getCurrentPharmacyId();
        // Fetch all matching records to allow filtering in memory for derived status
        // In a real production app with millions of records, this would use a
        // Specification or native query to handle filtering at the database level.
        Pageable pageable = Pageable.unpaged();
        Page<PharmacyInventory> inventoryPage = inventoryRepository.findByPharmacyIdAndSearch(pharmacyId, search,
                pageable);

        java.util.List<MedicineInventoryDTO> allDtos = inventoryPage.getContent().stream()
                .map(this::mapToDTO)
                .filter(dto -> {
                    if (filter == null || filter.equals("All") || filter.equals("Total Medicines") || filter.isEmpty())
                        return true;
                    return dto.getStatus().equalsIgnoreCase(filter.replace(" Medicines", ""));
                })
                .collect(java.util.stream.Collectors.toList());

        long offset = (long) page * size;
        int start = (int) Math.min(offset, (long) allDtos.size());
        int end = (int) Math.min(offset + size, (long) allDtos.size());

        java.util.List<MedicineInventoryDTO> pagedList = new java.util.ArrayList<>(allDtos.subList(start, end));

        return new org.springframework.data.domain.PageImpl<>(
                pagedList,
                PageRequest.of(page, size),
                allDtos.size());
    }

    public MedicineDetailDTO getMedicineDetails(Long medicineId) {
        PharmacyInventory inventory = inventoryRepository.findById(java.util.Objects.requireNonNull(medicineId))
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + medicineId));

        return mapToDetailDTO(inventory);
    }

    public void updateStock(Long inventoryId, Integer newQuantity) {
        PharmacyInventory inventory = inventoryRepository.findById(java.util.Objects.requireNonNull(inventoryId))
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventory.setAvailableQuantity(newQuantity);
        inventoryRepository.save(inventory);

        checkStockAndNotify(inventory);
    }

    public void updatePrice(Long inventoryId, java.math.BigDecimal newPrice) {
        PharmacyInventory inventory = inventoryRepository.findById(java.util.Objects.requireNonNull(inventoryId))
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventory.setPrice(newPrice);
        inventoryRepository.save(inventory);
    }

    public void deactivateMedicine(Long inventoryId) {
        PharmacyInventory inventory = inventoryRepository.findById(java.util.Objects.requireNonNull(inventoryId))
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        Medicine medicine = inventory.getMedicine();
        medicine.setStatus(Medicine.MedicineStatus.INACTIVE);
        medicineRepository.save(medicine);
    }

    public void deleteFromInventory(Long inventoryId) {
        inventoryRepository.deleteById(java.util.Objects.requireNonNull(inventoryId));
    }

    public void activateMedicine(Long inventoryId) {
        PharmacyInventory inventory = inventoryRepository.findById(java.util.Objects.requireNonNull(inventoryId))
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
        Medicine medicine = inventory.getMedicine();
        medicine.setStatus(Medicine.MedicineStatus.ACTIVE);
        medicineRepository.save(medicine);
    }

    public void addMedicineToInventory(MedicineInventoryDTO dto) {
        Long pharmacyId = getCurrentPharmacyId();

        Medicine medicine;
        Long medicineId = dto.getMedicineId();
        if (medicineId != null) {
            medicine = medicineRepository.findById(medicineId)
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));
        } else {
            medicine = new Medicine();
            medicine.setMedicineName(dto.getMedicineName());
            medicine.setGenericName(dto.getGenericName());
            medicine.setManufacturer(dto.getManufacturer());
            medicine.setDosageForm(dto.getDosageForm());
            medicine.setStrength(dto.getStrength());
            medicine.setRequiresPrescription(dto.isRequiresPrescription());
            medicine.setImageUrl(dto.getImageUrl());
            medicine.setActiveIngredients(dto.getActiveIngredients());
            medicine.setStatus(Medicine.MedicineStatus.ACTIVE);
            medicine = medicineRepository.save(medicine);
        }

        PharmacyInventory inventory = new PharmacyInventory();
        com.findmymeds.backend.model.Pharmacy pharmacy = new com.findmymeds.backend.model.Pharmacy();
        pharmacy.setId(pharmacyId);
        inventory.setPharmacy(pharmacy);
        inventory.setMedicine(medicine);
        inventory.setAvailableQuantity(dto.getStockQuantity());
        inventory.setPrice(dto.getPrice());
        inventory.setExpiryDate(dto.getExpiryDate());

        inventoryRepository.save(inventory);
    }

    public void updateInventory(Long inventoryId, MedicineInventoryDTO dto) {
        PharmacyInventory inventory = inventoryRepository.findById(java.util.Objects.requireNonNull(inventoryId))
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventory.setAvailableQuantity(dto.getStockQuantity());
        inventory.setPrice(dto.getPrice());
        inventory.setExpiryDate(dto.getExpiryDate());

        Medicine medicine = inventory.getMedicine();
        medicine.setMedicineName(dto.getMedicineName());
        medicine.setGenericName(dto.getGenericName());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setDosageForm(dto.getDosageForm());
        medicine.setStrength(dto.getStrength());
        medicine.setRequiresPrescription(dto.isRequiresPrescription());
        medicine.setImageUrl(dto.getImageUrl());
        medicine.setActiveIngredients(dto.getActiveIngredients());

        medicineRepository.save(medicine);
        inventoryRepository.save(inventory);
    }

    private void checkStockAndNotify(PharmacyInventory inventory) {
        if (inventory.getAvailableQuantity() == 0) {
            notificationService.createNotification(
                    UserType.PHARMACY,
                    inventory.getPharmacy().getId(),
                    NotificationType.MEDICINE,
                    "Out of Stock Alert",
                    "Medicine " + inventory.getMedicine().getMedicineName() + " is out of stock!",
                    Priority.CRITICAL,
                    inventory.getId());
        } else if (inventory.getAvailableQuantity() <= 10) {
            notificationService.createNotification(
                    UserType.PHARMACY,
                    inventory.getPharmacy().getId(),
                    NotificationType.MEDICINE,
                    "Low Stock Alert",
                    "Medicine " + inventory.getMedicine().getMedicineName() + " is running low ("
                            + inventory.getAvailableQuantity() + " left).",
                    Priority.WARNING,
                    inventory.getId());
        }
    }

    private MedicineInventoryDTO mapToDTO(PharmacyInventory inventory) {
        Medicine medicine = inventory.getMedicine();
        MedicineInventoryDTO dto = new MedicineInventoryDTO();
        dto.setInventoryId(inventory.getId());
        dto.setMedicineId(medicine.getId());
        dto.setMedicineName(medicine.getMedicineName());
        dto.setGenericName(medicine.getGenericName());
        dto.setManufacturer(medicine.getManufacturer());
        dto.setDosageForm(medicine.getDosageForm());
        dto.setStrength(medicine.getStrength());
        dto.setRequiresPrescription(medicine.isRequiresPrescription());
        dto.setStockQuantity(inventory.getAvailableQuantity());
        dto.setPrice(inventory.getPrice());
        dto.setImageUrl(medicine.getImageUrl());
        dto.setExpiryDate(inventory.getExpiryDate());
        dto.setActiveIngredients(medicine.getActiveIngredients());

        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate thirtyDaysLater = today.plusDays(30);

        if (medicine.getStatus() == Medicine.MedicineStatus.INACTIVE) {
            dto.setStatus("Deactivated");
        } else if (inventory.getExpiryDate() != null && inventory.getExpiryDate().isBefore(today)) {
            dto.setStatus("Expired");
        } else if (inventory.getExpiryDate() != null && !inventory.getExpiryDate().isAfter(thirtyDaysLater)) {
            dto.setStatus("Expiring Soon");
        } else if (inventory.getAvailableQuantity() == 0) {
            dto.setStatus("Out of Stock");
        } else if (inventory.getAvailableQuantity() <= 10) {
            dto.setStatus("Low Stock");
        } else {
            dto.setStatus("In Stock");
        }

        return dto;
    }

    private MedicineDetailDTO mapToDetailDTO(PharmacyInventory inventory) {
        Medicine medicine = inventory.getMedicine();
        MedicineDetailDTO dto = new MedicineDetailDTO();

        dto.setInventoryId(inventory.getId());
        dto.setMedicineId(medicine.getId());
        dto.setMedicineName(medicine.getMedicineName());
        dto.setGenericName(medicine.getGenericName());
        dto.setType(medicine.getType());
        dto.setManufacturer(medicine.getManufacturer());
        dto.setCountryOfManufacture(medicine.getCountryOfManufacture());
        dto.setRegistrationNumber(medicine.getRegistrationNumber());
        dto.setDosageForm(medicine.getDosageForm());
        dto.setStrength(medicine.getStrength());
        dto.setStorageInstructions(medicine.getStorageInstructions());
        dto.setDescription(medicine.getDescription());
        dto.setRequiresPrescription(medicine.isRequiresPrescription());
        dto.setImageUrl(medicine.getImageUrl());
        dto.setActiveIngredients(medicine.getActiveIngredients());

        dto.setAvailableQuantity(inventory.getAvailableQuantity());
        dto.setPrice(inventory.getPrice());
        dto.setExpiryDate(inventory.getExpiryDate());
        dto.setBatchNumber(inventory.getBatchNumber());
        dto.setApprovalStatus(medicine.getApprovalStatus() != null ? medicine.getApprovalStatus().name() : "PENDING");

        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate thirtyDaysLater = today.plusDays(30);

        if (medicine.getStatus() == Medicine.MedicineStatus.INACTIVE) {
            dto.setStatus("Deactivated");
        } else if (inventory.getExpiryDate() != null && inventory.getExpiryDate().isBefore(today)) {
            dto.setStatus("Expired");
        } else if (inventory.getExpiryDate() != null && !inventory.getExpiryDate().isAfter(thirtyDaysLater)) {
            dto.setStatus("Expiring Soon");
        } else if (inventory.getAvailableQuantity() == 0) {
            dto.setStatus("Out of Stock");
        } else if (inventory.getAvailableQuantity() <= 10) {
            dto.setStatus("Low Stock");
        } else {
            dto.setStatus("In Stock");
        }

        return dto;
    }
}
