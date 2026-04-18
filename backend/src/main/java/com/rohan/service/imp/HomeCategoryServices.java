package com.rohan.service.imp;

import com.rohan.model.HomeCategory;
import com.rohan.model.HomeCategorySection;

import java.util.List;

public interface HomeCategoryServices {
    HomeCategory createHomeCategory(HomeCategory homeCategory);
    List<HomeCategory> createCategories(List<HomeCategory> homeCategories);
    HomeCategory updateHomeCategory(HomeCategory homeCategory);
    List<HomeCategory> getAllHomeCategories();
    
    // Additional methods for controller
    HomeCategory getHomeCategoryById(Long id);
    List<HomeCategory> getHomeCategoriesBySection(HomeCategorySection section);
    List<HomeCategory> getHomeCategoriesByCategoryId(String categoryId);
    void deleteHomeCategory(Long id);
    HomeCategory updateCategorySection(Long id, HomeCategorySection section);
    Long getTotalHomeCategoryCount();
}
