package com.rohan.service.imp;

import com.rohan.Repository.HomeCategoryRepository;
import com.rohan.model.HomeCategory;
import com.rohan.model.HomeCategorySection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HomeCategoryServiceimpl implements HomeCategoryServices {
    
    private final HomeCategoryRepository homeCategoryRepository;
    
    @Override
    @Transactional
    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
        return homeCategoryRepository.save(homeCategory);
    }
    
    @Override
    @Transactional
    public List<HomeCategory> createCategories(List<HomeCategory> homeCategories) {
        return homeCategoryRepository.saveAll(homeCategories);
    }
    
    @Override
    @Transactional
    public HomeCategory updateHomeCategory(HomeCategory homeCategory) {
        HomeCategory existingCategory = homeCategoryRepository.findById(homeCategory.getId())
                .orElseThrow(() -> new RuntimeException("HomeCategory not found with id: " + homeCategory.getId()));
        
        existingCategory.setName(homeCategory.getName());
        existingCategory.setImage(homeCategory.getImage());
        existingCategory.setCategoryId(homeCategory.getCategoryId());
        existingCategory.setSection(homeCategory.getSection());
        
        return homeCategoryRepository.save(existingCategory);
    }
    
    @Override
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepository.findAll();
    }
    
    // Additional utility methods
    public HomeCategory getHomeCategoryById(Long id) {
        return homeCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HomeCategory not found with id: " + id));
    }
    
    public List<HomeCategory> getHomeCategoriesBySection(HomeCategorySection section) {
        return homeCategoryRepository.findBySection(section);
    }
    
    public List<HomeCategory> getHomeCategoriesByCategoryId(String categoryId) {
        return homeCategoryRepository.findByCategoryId(categoryId);
    }
    
    @Transactional
    public void deleteHomeCategory(Long id) {
        HomeCategory category = getHomeCategoryById(id);
        homeCategoryRepository.delete(category);
    }
    
    @Transactional
    public HomeCategory updateCategorySection(Long id, HomeCategorySection section) {
        HomeCategory category = getHomeCategoryById(id);
        category.setSection(section);
        return homeCategoryRepository.save(category);
    }
    
    public boolean homeCategoryExists(Long id) {
        return homeCategoryRepository.existsById(id);
    }
    
    public Long getTotalHomeCategoryCount() {
        return homeCategoryRepository.count();
    }
}
