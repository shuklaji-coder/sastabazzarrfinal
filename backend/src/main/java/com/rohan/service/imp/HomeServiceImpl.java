package com.rohan.service.imp;

import com.rohan.Repository.HomeCategoryRepository;
import com.rohan.model.Home;
import com.rohan.model.HomeCategory;
import com.rohan.model.HomeCategorySection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {
    
    private final HomeCategoryRepository homeCategoryRepository;
    
    @Override
    @Transactional(readOnly = true)
    public Home getHomePageData() {
        Home home = new Home();
        
        // Get categories by different sections
        List<HomeCategory> allCategories = homeCategoryRepository.findAll();
        
        // Filter by sections
        home.setCategories(allCategories);
        home.setShopbycategories(getCategoriesBySection(allCategories, HomeCategorySection.SHOP_BY_CATEGORIES));
        home.setElectroniccategories(getCategoriesBySection(allCategories, HomeCategorySection.ELECTRICS_CATEGORIES));
        home.setDealcategories(getCategoriesBySection(allCategories, HomeCategorySection.DEALS));
        
        return home;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<HomeCategory> getHomeCategoriesBySection(HomeCategorySection section) {
        return homeCategoryRepository.findBySection(section);
    }
    
    @Override
    @Transactional
    public Home createHomePageData(List<HomeCategory> categories) {
        // Save all categories
        List<HomeCategory> savedCategories = homeCategoryRepository.saveAll(categories);
        
        // Build home page data
        Home home = new Home();
        home.setCategories(savedCategories);
        home.setShopbycategories(getCategoriesBySection(savedCategories, HomeCategorySection.SHOP_BY_CATEGORIES));
        home.setElectroniccategories(getCategoriesBySection(savedCategories, HomeCategorySection.ELECTRICS_CATEGORIES));
        home.setDealcategories(getCategoriesBySection(savedCategories, HomeCategorySection.DEALS));
        
        return home;
    }
    
    @Override
    @Transactional
    public Home updateHomePageData(Home home) {
        // This would typically update the home categories
        // For now, we'll return the current home data
        return getHomePageData();
    }
    
    @Override
    @Transactional
    public void refreshHomeCategories() {
        // This method could be used to refresh cached home categories
        // Implementation depends on your caching strategy
        // For now, it's a placeholder
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepository.findAll();
    }
    
    // Helper method to filter categories by section
    private List<HomeCategory> getCategoriesBySection(List<HomeCategory> categories, HomeCategorySection section) {
        return categories.stream()
                .filter(category -> section.equals(category.getSection()))
                .collect(Collectors.toList());
    }
    
    // Additional utility methods
    
    @Transactional(readOnly = true)
    public List<HomeCategory> getActiveHomeCategories() {
        return homeCategoryRepository.findAll().stream()
                .filter(category -> category.getImage() != null && !category.getImage().isEmpty())
                .filter(category -> category.getName() != null && !category.getName().isEmpty())
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public HomeCategory getHomeCategoryById(Long id) {
        return homeCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HomeCategory not found with id: " + id));
    }
    
    @Transactional
    public HomeCategory addHomeCategory(HomeCategory homeCategory) {
        return homeCategoryRepository.save(homeCategory);
    }
    
    @Transactional
    public void deleteHomeCategory(Long id) {
        HomeCategory category = getHomeCategoryById(id);
        homeCategoryRepository.delete(category);
    }
    
    @Transactional
    public HomeCategory updateHomeCategory(Long id, HomeCategory homeCategoryDetails) {
        HomeCategory existingCategory = getHomeCategoryById(id);
        
        existingCategory.setName(homeCategoryDetails.getName());
        existingCategory.setImage(homeCategoryDetails.getImage());
        existingCategory.setCategoryId(homeCategoryDetails.getCategoryId());
        existingCategory.setSection(homeCategoryDetails.getSection());
        
        return homeCategoryRepository.save(existingCategory);
    }
    
    @Transactional(readOnly = true)
    public long getTotalHomeCategoryCount() {
        return homeCategoryRepository.count();
    }
    
    @Transactional(readOnly = true)
    public List<HomeCategory> getHomeCategoriesByCategoryType(String categoryId) {
        return homeCategoryRepository.findByCategoryId(categoryId);
    }
}
