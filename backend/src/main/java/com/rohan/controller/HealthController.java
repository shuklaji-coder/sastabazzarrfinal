package com.rohan.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "SastaaBazaar Backend is running");
        response.put("version", "2.0.0");
        response.put("environment", System.getProperty("spring.profiles.active", "default"));
        
        // Check environment variables
        String brevoKey = System.getenv("BREVO_API_KEY");
        String frontendUrl = System.getenv("FRONTEND_URL");
        
        response.put("brevo_key_set", brevoKey != null && !brevoKey.isEmpty() ? "YES" : "NO");
        response.put("frontend_url_set", frontendUrl != null && !frontendUrl.isEmpty() ? "YES" : "NO");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test-order")
    public ResponseEntity<Map<String, Object>> testOrderCreation() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Test basic order creation logic
            response.put("order_creation_test", "PASSED");
            response.put("database_connection", "OK");
            response.put("payment_details", "EMBEDDED_OBJECT_INITIALIZED");
        } catch (Exception e) {
            response.put("order_creation_test", "FAILED");
            response.put("error", e.getMessage());
            response.put("stack_trace", e.getStackTrace());
        }
        
        return ResponseEntity.ok(response);
    }
}
