package com.rohan.controller;

import com.rohan.Repository.UserRepository;
import com.rohan.Repository.VerificationCodeRepository;
import com.rohan.model.User;
import com.rohan.model.VerificationCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/debug")
@RequiredArgsConstructor
public class DebugController {

    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;

    @GetMapping("/admin-exists")
    public ResponseEntity<String> checkAdmin() {
        User admin = userRepository.findByEmail("shuklarohan388@gmail.com");
        if (admin != null) {
            return ResponseEntity.ok("Admin exists: " + admin.getEmail() + ", Role: " + admin.getRole());
        }
        return ResponseEntity.ok("Admin does not exist");
    }

    @GetMapping("/otp-for/{email}")
    public ResponseEntity<String> getOtpForEmail(@PathVariable String email) {
        VerificationCode vc = verificationCodeRepository.findByEmail(email);
        if (vc != null) {
            return ResponseEntity.ok("OTP for " + email + ": " + vc.getOtp());
        }
        return ResponseEntity.ok("No OTP found for " + email);
    }

    @PostMapping("/create-admin-now")
    public ResponseEntity<String> forceCreateAdmin() {
        try {
            // Delete existing admin if any
            User existingAdmin = userRepository.findByEmail("shuklarohan388@gmail.com");
            if (existingAdmin != null) {
                userRepository.delete(existingAdmin);
            }

            // Create new admin
            User admin = new User();
            admin.setEmail("shuklarohan388@gmail.com");
            admin.setFullname("Rohan Shukla");
            admin.setMobile("9876543210");
            admin.setRole(com.rohan.model.USER_ROLE.ROLE_ADMIN);
            admin.setPassword("$2a$10$N.zmdr9k7uOCQb376No9l7scG6c9tI7W8JQKxKQBPg/C"); // admin123

            userRepository.save(admin);

            return ResponseEntity.ok("Admin created successfully!\nEmail: shuklarohan388@gmail.com\nPassword: admin123");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
