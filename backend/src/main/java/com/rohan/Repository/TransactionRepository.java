package com.rohan.Repository;

import com.rohan.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByOrderId(Long orderId);
    
    boolean existsByOrderId(Long orderId);
    
    List<Transaction> findBySellerId(Long sellerId);
    
    List<Transaction> findByCustomerId(Long customerId);
    
    List<Transaction> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    Long countBySellerId(Long sellerId);
    
    Long countByCustomerId(Long customerId);
    
    List<Transaction> findByOrderUserId(Long userId);
}
