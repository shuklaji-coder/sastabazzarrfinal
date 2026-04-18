package com.rohan.Repository;

import com.rohan.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DealRepository extends JpaRepository<Deal, Long> {
    
    List<Deal> findByDiscountGreaterThan(Integer discount);
    
    List<Deal> findByCategory_Id(Long categoryId);
    
    boolean existsByCategory_Id(Long categoryId);
}
