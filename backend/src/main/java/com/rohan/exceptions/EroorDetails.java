package com.rohan.exceptions;

import java.time.LocalDateTime;

public class EroorDetails {

    private LocalDateTime timestamp;
    private String error;
    private String details;

    public EroorDetails(LocalDateTime timestamp, String error, String details) {
        this.timestamp = timestamp;
        this.error = error;
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getError() {
        return error;
    }

    public String getDetails() {
        return details;
    }
}