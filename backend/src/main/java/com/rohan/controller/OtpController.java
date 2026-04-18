package com.rohan.controller;

import com.rohan.service.imp.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required", "success", false));
        }

        otpService.generateAndSendOtp(email);
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + email, "success", true));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and OTP are required", "success", false));
        }

        boolean isValid = otpService.verifyOtp(email, otp);
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully", "success", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP", "success", false));
        }
    }
}
