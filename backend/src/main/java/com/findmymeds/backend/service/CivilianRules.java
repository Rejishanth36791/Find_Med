package com.findmymeds.backend.service;

public final class CivilianRules {

    public static final int MAX_TEMP_BANS = 2;
    public static final int MAX_APPEALS = 2;
    public static final int APPEAL_WINDOW_DAYS = 14;
    public static final int AUTO_DELETE_DAYS = 90;

    private CivilianRules() {
        // prevent instantiation
    }
}
