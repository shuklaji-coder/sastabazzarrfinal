package com.rohan.controller;

import com.rohan.model.Order;
import com.rohan.model.User;
import com.rohan.request.NegotiationRequestDTO;
import com.rohan.response.NegotiationResponseDTO;
import com.rohan.service.imp.NegotiationService;
import com.rohan.service.imp.OrderService;
import com.rohan.service.imp.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/negotiate")
@CrossOrigin(origins = "http://localhost:3000")
public class NegotiationController {

    @Autowired
    private NegotiationService negotiationService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    // Delegate to non-blocking ML call
    @PostMapping
    public Mono<ResponseEntity<NegotiationResponseDTO>> negotiate(
            @RequestHeader(value = "Authorization", required = false) String jwt,
            @Valid @RequestBody NegotiationRequestDTO request) {
        
        try {
            // Apply required defaults
            if (request.getMarketCondition() == null || request.getMarketCondition().isEmpty()) {
                request.setMarketCondition("normal");
            }
            if (request.getRoundNumber() == 1 && request.getPrevUserOffer() == null) {
                request.setPrevUserOffer(request.getUserOffer());
            }

            // Apply loyalty factor if logged in
            if (jwt != null && !jwt.isEmpty() && jwt.startsWith("Bearer ")) {
                User user = userService.findUserByJwtToken(jwt);
                if (user != null) {
                    List<Order> orders = orderService.usersOrderHistory(user.getId());
                    int totalOrders = orders != null ? orders.size() : 0;
                    
                    request.setIsRegular(totalOrders > 0 ? 1 : 0);
                    request.setTotalOrders(totalOrders);
                    // The SastaaBazaar User entity does not track signup dates easily here,
                    // so we compute a placeholder tenure based on order count.
                    request.setTenureDays(totalOrders > 0 ? 365 : 10);
                } else {
                    setGuestDefaults(request);
                }
            } else {
                setGuestDefaults(request);
            }
        } catch (Exception e) {
            // Safely fallback on guest limits without crashing negotiation
            setGuestDefaults(request);
        }

        return negotiationService.negotiate(request)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/warmup")
    public ResponseEntity<String> warmup() {
        negotiationService.warmup();
        return ResponseEntity.ok("Warm-up triggered");
    }

    private void setGuestDefaults(NegotiationRequestDTO request) {
        // Enforce guest default limits
        request.setIsRegular(0);
        request.setTotalOrders(0);
        request.setTenureDays(0);
    }
}
