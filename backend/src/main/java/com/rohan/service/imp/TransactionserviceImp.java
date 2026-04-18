package com.rohan.service.imp;

import com.rohan.Repository.SellerRepository;
import com.rohan.Repository.TransactionRepository;
import com.rohan.model.Order;
import com.rohan.model.Seller;
import com.rohan.model.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionserviceImp implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final SellerRepository sellerRepository;

    @Override
    public Transaction createTransaction(Order order) {
        Seller seller = sellerRepository
                .findById(order.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Transaction transaction = new Transaction();
        transaction.setSeller(seller);
        transaction.setCustomer(order.getUser());
        transaction.setOrder(order);

        return transactionRepository.save(transaction);

    }

    @Override
    public List<Transaction> getTransactionsBySeller(Seller seller) {
        return transactionRepository.findBySellerId(seller.getId());



    }

    @Override
    public List<Transaction> getAllTranasactions() {
        return transactionRepository.findAll();

    }
}