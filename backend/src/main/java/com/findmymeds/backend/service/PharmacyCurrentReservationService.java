package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.MedicineDTO;
import com.findmymeds.backend.dto.CivilianDTO;
import com.findmymeds.backend.dto.ReservationDTO;
import com.findmymeds.backend.dto.ReservationItemDTO;
import com.findmymeds.backend.model.Reservation;
import com.findmymeds.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PharmacyCurrentReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    public List<Long> getCurrentReservationCounts(Long pharmacyId) {
        return List.of(
                reservationRepository.countByPharmacyIdAndStatus(pharmacyId,
                        com.findmymeds.backend.model.enums.ReservationStatus.PENDING),
                reservationRepository.countByPharmacyIdAndStatus(pharmacyId,
                        com.findmymeds.backend.model.enums.ReservationStatus.CONFIRMED),
                reservationRepository.countByPharmacyIdAndStatus(pharmacyId,
                        com.findmymeds.backend.model.enums.ReservationStatus.ONGOING),
                reservationRepository.countByPharmacyIdAndStatus(pharmacyId,
                        com.findmymeds.backend.model.enums.ReservationStatus.READY),
                reservationRepository.countByPharmacyIdAndStatus(pharmacyId,
                        com.findmymeds.backend.model.enums.ReservationStatus.COLLECTED),
                reservationRepository.countByPharmacyIdAndStatus(pharmacyId,
                        com.findmymeds.backend.model.enums.ReservationStatus.CANCELLED));
    }

    public List<ReservationDTO> getCurrentReservationsByStatus(Long pharmacyId, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reservationRepository
                .findByPharmacyIdAndStatus(pharmacyId,
                        com.findmymeds.backend.model.enums.ReservationStatus.valueOf(status), pageable)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void updateReservationStatus(@NonNull Long id, String status) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow();
        reservation.setStatus(com.findmymeds.backend.model.enums.ReservationStatus.valueOf(status));
        reservationRepository.save(reservation);
    }

    public ReservationDTO getReservationDetails(@NonNull Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow();
        return convertToDTO(reservation);
    }

    public List<ReservationDTO> getAllCurrentReservations(Long pharmacyId) {
        // Fetch all reservations for the pharmacy that are NOT cancelled or
        // collected/expired if that's what "current" means.
        // Or simply fetch PENDING, CONFIRMED, READY, ONGOING.
        List<com.findmymeds.backend.model.enums.ReservationStatus> activeStatuses = List.of(
                com.findmymeds.backend.model.enums.ReservationStatus.PENDING,
                com.findmymeds.backend.model.enums.ReservationStatus.CONFIRMED,
                com.findmymeds.backend.model.enums.ReservationStatus.ONGOING,
                com.findmymeds.backend.model.enums.ReservationStatus.READY);

        // This is inefficient if we have many, but matches the "mock" simple list
        // behavior.
        // We should filters in DB. Ideally add findByPharmacyIdAndStatusIn...
        return reservationRepository.findAll().stream()
                .filter(r -> r.getPharmacy() != null && r.getPharmacy().getId().equals(pharmacyId))
                .filter(r -> activeStatuses.contains(r.getStatus()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReservationDTO convertToDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId().toString());
        dto.setStatus(reservation.getStatus().name());
        dto.setReservationDate(reservation.getReservationDate());
        dto.setTimeframe(reservation.getTimeframe());
        dto.setTotalAmount(reservation.getTotalAmount());
        dto.setPrescriptionImageUrl(reservation.getPrescriptionImageUrl());
        dto.setNote(reservation.getNote());

        if (reservation.getCivilian() != null) {
            CivilianDTO civDto = new CivilianDTO();
            civDto.setId(reservation.getCivilian().getId());
            civDto.setName(reservation.getCivilian().getFullName());
            civDto.setEmail(reservation.getCivilian().getEmail());
            civDto.setPhone(reservation.getCivilian().getPhone());
            dto.setCivilian(civDto);
        }

        if (reservation.getItems() != null) {
            dto.setItems(reservation.getItems().stream().map(item -> {
                ReservationItemDTO itemDto = new ReservationItemDTO();
                itemDto.setId(item.getId());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setPrice(item.getPrice());

                if (item.getMedicine() != null) {
                    MedicineDTO medDto = new MedicineDTO();
                    medDto.setId(item.getMedicine().getId());
                    medDto.setMedicineName(item.getMedicine().getMedicineName());
                    medDto.setBrand(item.getMedicine().getManufacturer());
                    medDto.setPrice(item.getMedicine().getPrice());
                    itemDto.setMedicine(medDto);
                }
                return itemDto;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
