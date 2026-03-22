package com.rohan.service.imp;

import com.rohan.model.Order;
import com.rohan.model.Seller;
import com.rohan.model.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction createTransaction(Order order);

    List<Transaction> getTransactionsBySeller(Seller seller);

    List<Transaction> getAllTranasactions();
}