package com.rohan.Repository;

import com.rohan.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionInterface extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySellerId(Long sellerId);

}