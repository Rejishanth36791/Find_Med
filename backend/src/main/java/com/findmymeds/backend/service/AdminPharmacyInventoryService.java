package com.findmymeds.backend.service;

import com.findmymeds.backend.model.PharmacyInventory;
import com.findmymeds.backend.repository.AdminPharmacyInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminPharmacyInventoryService {

    @Autowired
    private AdminPharmacyInventoryRepository inventoryRepository;

    public List<PharmacyInventory> getInventoryByPharmacy(Long pharmacyId) {
        return inventoryRepository.findByPharmacyId(pharmacyId);
    }

    public PharmacyInventory saveInventory(@org.springframework.lang.NonNull PharmacyInventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public PharmacyInventory updateInventory(@org.springframework.lang.NonNull PharmacyInventory inventory) {
        return inventoryRepository.save(inventory);
    }
}
