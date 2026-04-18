package com.rohan.Repository;

import com.rohan.model.HomeCategory;
import com.rohan.model.HomeCategorySection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomeCategoryRepository extends JpaRepository<HomeCategory, Long> {
    
    List<HomeCategory> findBySection(HomeCategorySection section);
    
    List<HomeCategory> findByCategoryId(String categoryId);
    
    List<HomeCategory> findByNameContainingIgnoreCase(String name);
    
    boolean existsByCategoryId(String categoryId);
}
