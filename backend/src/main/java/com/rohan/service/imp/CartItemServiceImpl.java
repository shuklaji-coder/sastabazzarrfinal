package com.rohan.service.imp;

import com.rohan.Repository.CartItemRepository;
import com.rohan.model.Cart;
import com.rohan.model.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem updateCartItem(CartItem cartItem) {

        if (cartItem.getId() == null) {
            throw new RuntimeException("Cart Item ID is required");
        }

        if (cartItem.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        CartItem existingItem = cartItemRepository.findById(cartItem.getId())
                .orElseThrow(() -> new RuntimeException("Cart Item Not Found"));

        if (existingItem.getProduct() == null) {
            throw new RuntimeException("Product not associated with cart item");
        }

        existingItem.setQuantity(cartItem.getQuantity());

        existingItem.setMrpPrice(
                existingItem.getQuantity() *
                        existingItem.getProduct().getMrpPrice()
        );

        existingItem.setSellingPrice(
                existingItem.getQuantity() *
                        existingItem.getProduct().getSellingPrice()
        );

        return cartItemRepository.save(existingItem);
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId) {

        CartItem item = findCartItemById(userId, cartItemId);

        // Simply delete the cart item - Hibernate will handle the relationship
        cartItemRepository.delete(item);
    }

    @Override
    public CartItem findCartItemById(Long userId, Long cartItemId) {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart Item Not Found"));

        if (item.getCart() == null ||
                item.getCart().getUser() == null ||
                !item.getCart().getUser().getId().equals(userId)) {

            throw new RuntimeException("YOU CANNOT ACCESS THIS CART ITEM");
        }

        return item;
    }
}