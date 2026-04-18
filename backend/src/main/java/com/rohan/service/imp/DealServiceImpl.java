package com.rohan.service.imp;

import com.rohan.Repository.DealRepository;
import com.rohan.model.Deal;
import com.rohan.model.HomeCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DealServiceImpl implements DealService {

    private final DealRepository dealRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Deal> getDeals() {
        return dealRepository.findAll();
    }

    @Override
    @Transactional
    public Deal createDeal(Deal deal) {
        // Validate deal data
        if (deal.getDiscount() == null || deal.getDiscount() <= 0) {
            throw new IllegalArgumentException("Discount must be greater than 0");
        }
        
        if (deal.getDiscount() > 100) {
            throw new IllegalArgumentException("Discount cannot be greater than 100");
        }
        
        // Check if deal already exists for this category
        if (deal.getCategory() != null && dealRepository.existsByCategory_Id(deal.getCategory().getId())) {
            throw new RuntimeException("Deal already exists for this category");
        }
        
        return dealRepository.save(deal);
    }

    @Override
    @Transactional
    public Deal updateDeal(Deal deal) {
        Deal existingDeal = getDealById(deal.getId());
        
        // Validate updated data
        if (deal.getDiscount() != null) {
            if (deal.getDiscount() <= 0) {
                throw new IllegalArgumentException("Discount must be greater than 0");
            }
            if (deal.getDiscount() > 100) {
                throw new IllegalArgumentException("Discount cannot be greater than 100");
            }
            existingDeal.setDiscount(deal.getDiscount());
        }
        
        if (deal.getCategory() != null) {
            // Check if another deal exists for this category
            Optional<Deal> existingDealForCategory = dealRepository.findByCategory_Id(deal.getCategory().getId())
                    .stream()
                    .filter(d -> !d.getId().equals(deal.getId()))
                    .findFirst();
            
            if (existingDealForCategory.isPresent()) {
                throw new RuntimeException("Deal already exists for this category");
            }
            
            existingDeal.setCategory(deal.getCategory());
        }
        
        return dealRepository.save(existingDeal);
    }

    @Override
    @Transactional
    public void deleteDeal(Deal deal) {
        Deal existingDeal = getDealById(deal.getId());
        dealRepository.delete(existingDeal);
    }
    
    // Additional utility methods
    @Transactional(readOnly = true)
    public Deal getDealById(Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<Deal> getDealsByDiscountGreaterThan(Integer discount) {
        return dealRepository.findByDiscountGreaterThan(discount);
    }
    
    @Transactional(readOnly = true)
    public List<Deal> getDealsByCategory(Long categoryId) {
        return dealRepository.findByCategory_Id(categoryId);
    }
    
    @Transactional(readOnly = true)
    public Deal getDealByCategory(Long categoryId) {
        List<Deal> deals = dealRepository.findByCategory_Id(categoryId);
        return deals.isEmpty() ? null : deals.get(0);
    }
    
    @Transactional
    public Deal createDealForCategory(Long categoryId, Integer discount) {
        HomeCategory category = new HomeCategory();
        category.setId(categoryId);
        
        Deal deal = new Deal();
        deal.setDiscount(discount);
        deal.setCategory(category);
        
        return createDeal(deal);
    }
    
    @Transactional
    public void deleteDealByCategory(Long categoryId) {
        List<Deal> deals = dealRepository.findByCategory_Id(categoryId);
        if (!deals.isEmpty()) {
            dealRepository.deleteAll(deals);
        }
    }
    
    @Transactional(readOnly = true)
    public Long getTotalDealCount() {
        return dealRepository.count();
    }
    
    @Transactional(readOnly = true)
    public List<Deal> getActiveDeals() {
        return dealRepository.findAll().stream()
                .filter(deal -> deal.getDiscount() != null && deal.getDiscount() > 0)
                .filter(deal -> deal.getCategory() != null)
                .toList();
    }
}
