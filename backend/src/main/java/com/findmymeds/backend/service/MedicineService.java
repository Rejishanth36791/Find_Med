package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.MedicineDetailDTO;
import com.findmymeds.backend.dto.MedicineSearchResponse;
import com.findmymeds.backend.dto.PharmacyInventoryDTO;
import com.findmymeds.backend.model.Medicine;
import com.findmymeds.backend.model.PharmacyInventory;
import com.findmymeds.backend.repository.MedicineRepository;
import com.findmymeds.backend.repository.PharmacyInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final PharmacyInventoryRepository pharmacyInventoryRepository;

    public MedicineSearchResponse getUnifiedSearch(String name) {
        MedicineSearchResponse response = new MedicineSearchResponse();

        Optional<Medicine> medicineOpt = medicineRepository.findByMedicineNameIgnoreCaseAndRemovedFalse(name);

        if (medicineOpt.isPresent()) {
            Medicine medicine = medicineOpt.get();
            response.setMedicineFound(true);

            // Map to MedicineDetailDTO
            MedicineDetailDTO detailDTO = new MedicineDetailDTO();
            detailDTO.setMedicineId(medicine.getId());
            detailDTO.setMedicineName(medicine.getMedicineName());
            detailDTO.setGenericName(medicine.getGenericName());
            detailDTO.setActiveIngredients(medicine.getActiveIngredients());
            detailDTO.setType(medicine.getType());
            detailDTO.setManufacturer(medicine.getManufacturer());
            detailDTO.setCountryOfManufacture(medicine.getCountryOfManufacture());
            detailDTO.setRegistrationNumber(medicine.getRegistrationNumber());
            detailDTO.setDosageForm(medicine.getDosageForm());
            detailDTO.setStrength(medicine.getStrength());
            detailDTO.setStorageInstructions(medicine.getStorageInstructions());
            detailDTO.setDescription(medicine.getDescription());
            detailDTO.setRequiresPrescription(medicine.isRequiresPrescription());
            detailDTO.setImageUrl(medicine.getImageUrl());

            // New fields
            detailDTO.setUsage(medicine.getUsageInstructions());
            detailDTO.setPrecautions(medicine.getPrecautions());
            detailDTO.setSideEffects(medicine.getSideEffects());

            response.setMedicineDetails(detailDTO);

            // Find pharmacies with stock > 0
            List<PharmacyInventory> inventories = pharmacyInventoryRepository.findPharmaciesWithStock(medicine.getId(),
                    1);

            // Map to DTO
            List<PharmacyInventoryDTO> pharmacyDTOs = inventories.stream()
                    .map(inv -> new PharmacyInventoryDTO(
                            inv.getPharmacy().getId(),
                            inv.getPharmacy().getName(),
                            inv.getPharmacy().getDistrict(), // Mapping district to city
                            inv.getPharmacy().getPhone(),
                            inv.getAvailableQuantity()))
                    .collect(Collectors.toList());

            response.setAvailablePharmacies(pharmacyDTOs);
        } else {
            response.setMedicineFound(false);
            response.setMedicineDetails(null);
            response.setAvailablePharmacies(Collections.emptyList());
        }

        return response;
    }
}
