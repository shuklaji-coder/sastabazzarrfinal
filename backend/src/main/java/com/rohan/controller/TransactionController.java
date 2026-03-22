package com.rohan.controller;

import com.rohan.exceptions.SellerException;
import com.rohan.model.Seller;
import com.rohan.model.Transaction;
import com.rohan.service.imp.SellerService;
import com.rohan.service.imp.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final SellerService sellerService;

    @GetMapping("/seller")
    public ResponseEntity<List<Transaction>> getTransactionBySeller(
            @RequestHeader("Authorization") String jwt) throws SellerException {

        Seller seller = sellerService.getSellerProfile(jwt);
        List<Transaction> transactions = transactionService.getTransactionsBySeller(seller);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTranasactions();
        return ResponseEntity.ok(transactions);
    }
}


