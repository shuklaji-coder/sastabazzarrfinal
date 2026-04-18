package com.rohan.controller;

import com.rohan.model.AccountStatus;
import com.rohan.model.Seller;
import com.rohan.model.USER_ROLE;
import com.rohan.model.User;
import com.rohan.Repository.UserRepository;
import com.rohan.service.imp.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AdminController {

    private final SellerService sellerService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PatchMapping("/seller/{id}/status/{status}")
    public ResponseEntity<Seller> updateSellerStatus(
            @PathVariable Long id,
            @PathVariable AccountStatus status) throws Exception {

        Seller updatedSeller = sellerService.updateSellerAccountStatus(id, status);
        return ResponseEntity.ok(updatedSeller);
    }

    @PostMapping("/admin/create")
    public ResponseEntity<String> createAdmin() {
        try {
            // Check if admin already exists
            User existingAdmin = userRepository.findByEmail("shuklarohan388@gmail.com");
            if (existingAdmin != null) {
                return ResponseEntity.badRequest().body("Admin user already exists");
            }

            // Create admin user
            User admin = new User();
            admin.setEmail("shuklarohan388@gmail.com");
            admin.setFullname("Rohan Shukla");
            admin.setMobile("9876543210");
            admin.setRole(USER_ROLE.ROLE_ADMIN);
            admin.setPassword(passwordEncoder.encode("admin123"));

            userRepository.save(admin);

            return ResponseEntity.ok("Admin user created successfully!\nEmail: shuklarohan388@gmail.com\nPassword: admin123");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating admin: " + e.getMessage());
        }
    }

    @GetMapping("/admin/check")
    public ResponseEntity<Boolean> checkAdmin() {
        User admin = userRepository.findByEmail("shuklarohan388@gmail.com");
        return ResponseEntity.ok(admin != null);
    }
}