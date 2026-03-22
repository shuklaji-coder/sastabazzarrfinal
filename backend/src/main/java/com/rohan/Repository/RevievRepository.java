package com.rohan.Repository;

import com.rohan.model.Reviev;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RevievRepository extends JpaRepository<Reviev, Long> {

    List<Reviev> findByProductId(Long productId);
    
    List<Reviev> findByUserId(Long userId);
    
    Long countByProductId(Long productId);
}
