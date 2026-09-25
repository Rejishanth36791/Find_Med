package com.findmymeds.backend.repository.projection;

import java.time.LocalDate;

public interface ReservationCountByDate {
    LocalDate getDate();

    long getCount();
}
