package com.rohan.controller;

import com.rohan.model.HomeCategory;
import com.rohan.model.HomeCategorySection;
import com.rohan.response.ApiResponse;
import com.rohan.service.imp.HomeCategoryServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home-categories")
@RequiredArgsConstructor
public class HomeCategoryController {
    
    private final HomeCategoryServices homeCategoryServices;
    
    @PostMapping
    public ResponseEntity<HomeCategory> createHomeCategory(@RequestBody HomeCategory homeCategory) {
        HomeCategory createdCategory = homeCategoryServices.createHomeCategory(homeCategory);
        return ResponseEntity.ok(createdCategory);
    }
    
    @PostMapping("/bulk")
    public ResponseEntity<List<HomeCategory>> createHomeCategories(@RequestBody List<HomeCategory> homeCategories) {
        List<HomeCategory> createdCategories = homeCategoryServices.createCategories(homeCategories);
        return ResponseEntity.ok(createdCategories);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HomeCategory> updateHomeCategory(
            @PathVariable Long id,
            @RequestBody HomeCategory homeCategory) {
        
        homeCategory.setId(id);
        HomeCategory updatedCategory = homeCategoryServices.updateHomeCategory(homeCategory);
        return ResponseEntity.ok(updatedCategory);
    }
    
    @GetMapping
    public ResponseEntity<List<HomeCategory>> getAllHomeCategories() {
        List<HomeCategory> categories = homeCategoryServices.getAllHomeCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HomeCategory> getHomeCategoryById(@PathVariable Long id) {
        HomeCategory category = homeCategoryServices.getHomeCategoryById(id);
        return ResponseEntity.ok(category);
    }
    
    @GetMapping("/section/{section}")
    public ResponseEntity<List<HomeCategory>> getHomeCategoriesBySection(@PathVariable HomeCategorySection section) {
        List<HomeCategory> categories = homeCategoryServices.getHomeCategoriesBySection(section);
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<HomeCategory>> getHomeCategoriesByCategoryId(@PathVariable String categoryId) {
        List<HomeCategory> categories = homeCategoryServices.getHomeCategoriesByCategoryId(categoryId);
        return ResponseEntity.ok(categories);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteHomeCategory(@PathVariable Long id) {
        homeCategoryServices.deleteHomeCategory(id);
        
        ApiResponse response = new ApiResponse();
        response.setMessage("Home category deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/section")
    public ResponseEntity<HomeCategory> updateCategorySection(
            @PathVariable Long id,
            @RequestParam HomeCategorySection section) {
        
        HomeCategory updatedCategory = homeCategoryServices.updateCategorySection(id, section);
        return ResponseEntity.ok(updatedCategory);
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalHomeCategoryCount() {
        Long count = homeCategoryServices.getTotalHomeCategoryCount();
        return ResponseEntity.ok(count);
    }
}
