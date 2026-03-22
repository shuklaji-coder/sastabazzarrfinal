package com.rohan.service.imp;



import com.rohan.Repository.CartItemRepository;

import com.rohan.Repository.CartRepository;

import com.rohan.model.Cart;

import com.rohan.model.CartItem;

import com.rohan.model.Product;

import com.rohan.model.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;



@Service

@RequiredArgsConstructor

public class CartServiceImpl implements CartService {



    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;



    @Override

    public CartItem addCartItem(User user, Product product, String size, int quantity) {



        // Find or create user's cart

        Cart cart = cartRepository.findByUserId(user.getId());

        

        if (cart == null) {

            cart = new Cart();

            cart.setUser(user);

            cart = cartRepository.save(cart);

        }



        // Check if item already exists in cart

        CartItem existingItem = cartItemRepository.findByCartAndProductAndSize(cart, product, size);

        

        if (existingItem != null) {

            // Update existing item quantity

            existingItem.setQuantity(existingItem.getQuantity() + quantity);

            existingItem.setSellingPrice(existingItem.getQuantity() * product.getSellingPrice());

            return cartItemRepository.save(existingItem);

        } else {

            // Add new item to cart

            CartItem cartItem = new CartItem();

            cartItem.setProduct(product);

            cartItem.setQuantity(quantity);

            cartItem.setUserId(user.getId());

            cartItem.setSize(size);

            cartItem.setCart(cart);

            

            int totalPrice = quantity * product.getSellingPrice();

            cartItem.setSellingPrice(totalPrice);

            cartItem.setMrpPrice(quantity * product.getMrpPrice());

            

            return cartItemRepository.save(cartItem);

        }

    }



    @Override
    @Transactional
    public Cart findUserCart(User user) {



        Cart cart = cartRepository.findByUserId(user.getId());



        if (cart == null) {

            // Create new cart if user doesn't have one

            cart = new Cart();

            cart.setUser(user);

            cart = cartRepository.save(cart);

        }



        int totalPrice = 0;

        int totalDiscountPrice = 0;

        int totalItem = 0;



        for (CartItem cartItem : cart.getCartItems()) {

            int itemMrp = cartItem.getMrpPrice() != null ? cartItem.getMrpPrice() : 0;

            int itemSellingPrice = cartItem.getSellingPrice() != null ? cartItem.getSellingPrice() : 0;



            totalPrice += itemMrp;

            totalDiscountPrice += itemSellingPrice;

            totalItem += cartItem.getQuantity();

        }



        cart.setTotalMrpPrice(totalPrice);

        cart.setTotalSellingPrice(totalDiscountPrice);

        cart.setTotalItem(totalItem);

        cart.setDiscount(calculateDiscount(totalPrice, totalDiscountPrice));



        return cart;

    }



    private int calculateDiscount(int mrpPrice, int sellingPrice) {



        if (mrpPrice == 0) {

            return 0;

        }



        int discount = mrpPrice - sellingPrice;

        return (discount * 100) / mrpPrice;

    }

}