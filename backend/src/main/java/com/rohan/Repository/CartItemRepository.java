package com.rohan.Repository;



import com.rohan.model.Cart;

import com.rohan.model.CartItem;

import com.rohan.model.Product;

import org.springframework.data.jpa.repository.JpaRepository;



public interface CartItemRepository extends JpaRepository<CartItem,Long> {





    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);







}

