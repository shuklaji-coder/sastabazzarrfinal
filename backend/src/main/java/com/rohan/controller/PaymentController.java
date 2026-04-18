package com.rohan.controller;

import com.razorpay.PaymentLink;
import com.rohan.model.*;
import com.rohan.response.ApiResponse;
import com.rohan.service.imp.PaymentService;
import com.rohan.service.imp.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    // ------------------- CREATE PAYMENT ORDER -------------------

    @PostMapping("/create")
    public ResponseEntity<PaymentOrder> createPaymentOrder(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        
        // Extract orders from payload (you'll need to implement proper DTO)
        // Set<Order> orders = extractOrdersFromPayload(payload);
        
        // For now, this is a placeholder implementation
        PaymentOrder paymentOrder = paymentService.createOrder(user, null);
        
        return new ResponseEntity<>(paymentOrder, HttpStatus.CREATED);
    }

    // ------------------- GET PAYMENT ORDER BY ID -------------------

    @GetMapping("/{orderId}")
    public ResponseEntity<PaymentOrder> getPaymentOrderById(
            @PathVariable String orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        PaymentOrder paymentOrder = paymentService.getPaymentOrderById(orderId);
        
        // Optional: Verify user owns this payment order
        if (!paymentOrder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only access your own payment orders");
        }

        return new ResponseEntity<>(paymentOrder, HttpStatus.OK);
    }

    // ------------------- GET PAYMENT ORDER BY PAYMENT ID -------------------

    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<PaymentOrder> getPaymentOrderByPaymentId(
            @PathVariable String paymentId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentId);
        
        // Optional: Verify user owns this payment order
        if (!paymentOrder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only access your own payment orders");
        }

        return new ResponseEntity<>(paymentOrder, HttpStatus.OK);
    }

    // ------------------- PROCESS PAYMENT -------------------

    @PostMapping("/process")
    public ResponseEntity<Boolean> processPayment(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        
        // Extract data from payload
        String paymentOrderId = (String) payload.get("paymentOrderId");
        String paymentId = (String) payload.get("paymentId");
        String paymentLinkId = (String) payload.get("paymentLinkId");
        
        // Get payment order
        PaymentOrder paymentOrder = paymentService.getPaymentOrderById(paymentOrderId);
        
        // Verify user owns this payment order
        if (!paymentOrder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only process your own payment orders");
        }
        
        Boolean result = paymentService.ProceedPaymentOrder(paymentOrder, paymentId, paymentLinkId);
        
        ApiResponse res = new ApiResponse();
        if (result) {
            res.setMessage("Payment processed successfully");
        } else {
            res.setMessage("Payment processing failed");
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // ------------------- CREATE RAZORPAY PAYMENT LINK -------------------

    @PostMapping("/razorpay/link")
    public ResponseEntity<PaymentLink> createRazorpayPaymentLink(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        
        Long amount = Long.valueOf(payload.get("amount").toString());
        Long orderId = Long.valueOf(payload.get("orderId").toString());
        
        PaymentLink paymentLink = paymentService.createRazorpayPaymentLink(user, amount, orderId);
        
        return new ResponseEntity<>(paymentLink, HttpStatus.OK);
    }

    // ------------------- CREATE STRIPE PAYMENT LINK -------------------

    @PostMapping("/stripe/link")
    public ResponseEntity<String> createStripePaymentLink(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        
        Long amount = Long.valueOf(payload.get("amount").toString());
        Long orderId = Long.valueOf(payload.get("orderId").toString());
        
        String paymentLink = paymentService.createStripePaymentLink(user, amount, orderId);
        
        return new ResponseEntity<>(paymentLink, HttpStatus.OK);
    }

    // ------------------- RAZORPAY CALLBACK -------------------

    @GetMapping("/razorpay/callback")
    public ResponseEntity<String> razorpayCallback(
            @RequestParam Map<String, String> allParams) {

        try {
            // Handle Razorpay callback
            String paymentId = allParams.get("razorpay_payment_id");
            String paymentLinkId = allParams.get("razorpay_payment_link_id");
            String paymentOrderId = allParams.get("razorpay_order_id");
            
            if (paymentId != null && paymentLinkId != null && paymentOrderId != null) {
                PaymentOrder paymentOrder = paymentService.getPaymentOrderById(paymentOrderId);
                paymentService.ProceedPaymentOrder(paymentOrder, paymentId, paymentLinkId);
                
                return ResponseEntity.ok("Payment successful");
            }
            
            return ResponseEntity.badRequest().body("Payment failed");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Callback processing failed: " + e.getMessage());
        }
    }

    // ------------------- STRIPE CALLBACK -------------------

    @GetMapping("/stripe/callback")
    public ResponseEntity<String> stripeCallback(
            @RequestParam Map<String, String> allParams) {

        try {
            // Handle Stripe callback
            String sessionId = allParams.get("session_id");
            
            if (sessionId != null) {
                // You'll need to implement Stripe session verification
                // and payment processing logic here
                
                return ResponseEntity.ok("Payment successful");
            }
            
            return ResponseEntity.badRequest().body("Payment failed");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Callback processing failed: " + e.getMessage());
        }
    }

    // ------------------- GET PAYMENT STATUS -------------------

    @GetMapping("/status/{paymentId}")
    public ResponseEntity<PaymentOrder> getPaymentStatus(
            @PathVariable String paymentId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentId);
        
        // Verify user owns this payment order
        if (!paymentOrder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only access your own payment orders");
        }

        return new ResponseEntity<>(paymentOrder, HttpStatus.OK);
    }

    // ------------------- CANCEL PAYMENT -------------------

    @PostMapping("/cancel/{paymentId}")
    public ResponseEntity<ApiResponse> cancelPayment(
            @PathVariable String paymentId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentId);
        
        // Verify user owns this payment order
        if (!paymentOrder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only cancel your own payment orders");
        }
        
        // Update payment order status to CANCELLED
        paymentOrder.setStatus(PaymentOrderStatus.FAILED);
        
        ApiResponse res = new ApiResponse();
        res.setMessage("Payment cancelled successfully");

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
