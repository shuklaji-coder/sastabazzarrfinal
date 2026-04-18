package com.rohan.controller;

import com.rohan.model.Deal;
import com.rohan.response.ApiResponse;
import com.rohan.service.imp.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {
    
    private final DealService dealService;
    
    @GetMapping
    public ResponseEntity<List<Deal>> getAllDeals() {
        List<Deal> deals = dealService.getDeals();
        return ResponseEntity.ok(deals);
    }
    
    @PostMapping
    public ResponseEntity<Deal> createDeal(@RequestBody Deal deal) {
        Deal createdDeal = dealService.createDeal(deal);
        return ResponseEntity.ok(createdDeal);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Deal> updateDeal(
            @PathVariable Long id,
            @RequestBody Deal deal) {
        
        deal.setId(id);
        Deal updatedDeal = dealService.updateDeal(deal);
        return ResponseEntity.ok(updatedDeal);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteDeal(@PathVariable Long id) {
        Deal deal = ((com.rohan.service.imp.DealServiceImpl) dealService).getDealById(id);
        dealService.deleteDeal(deal);
        
        ApiResponse response = new ApiResponse();
        response.setMessage("Deal deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Deal> getDealById(@PathVariable Long id) {
        Deal deal = ((com.rohan.service.imp.DealServiceImpl) dealService).getDealById(id);
        return ResponseEntity.ok(deal);
    }
    
    @GetMapping("/discount/{discount}")
    public ResponseEntity<List<Deal>> getDealsByDiscountGreaterThan(@PathVariable Integer discount) {
        List<Deal> deals = ((com.rohan.service.imp.DealServiceImpl) dealService)
                .getDealsByDiscountGreaterThan(discount);
        return ResponseEntity.ok(deals);
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Deal>> getDealsByCategory(@PathVariable Long categoryId) {
        List<Deal> deals = ((com.rohan.service.imp.DealServiceImpl) dealService)
                .getDealsByCategory(categoryId);
        return ResponseEntity.ok(deals);
    }
    
    @GetMapping("/category/{categoryId}/single")
    public ResponseEntity<Deal> getDealByCategory(@PathVariable Long categoryId) {
        Deal deal = ((com.rohan.service.imp.DealServiceImpl) dealService)
                .getDealByCategory(categoryId);
        
        if (deal == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(deal);
    }
    
    @PostMapping("/category/{categoryId}")
    public ResponseEntity<Deal> createDealForCategory(
            @PathVariable Long categoryId,
            @RequestParam Integer discount) {
        
        Deal deal = ((com.rohan.service.imp.DealServiceImpl) dealService)
                .createDealForCategory(categoryId, discount);
        return ResponseEntity.ok(deal);
    }
    
    @DeleteMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse> deleteDealByCategory(@PathVariable Long categoryId) {
        ((com.rohan.service.imp.DealServiceImpl) dealService).deleteDealByCategory(categoryId);
        
        ApiResponse response = new ApiResponse();
        response.setMessage("Deal(s) for category deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Deal>> getActiveDeals() {
        List<Deal> deals = ((com.rohan.service.imp.DealServiceImpl) dealService)
                .getActiveDeals();
        return ResponseEntity.ok(deals);
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalDealCount() {
        Long count = ((com.rohan.service.imp.DealServiceImpl) dealService)
                .getTotalDealCount();
        return ResponseEntity.ok(count);
    }
}
