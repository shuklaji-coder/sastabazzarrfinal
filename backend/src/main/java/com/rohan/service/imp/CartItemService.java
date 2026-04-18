package com.rohan.service.imp;

import com.rohan.model.CartItem;

public interface CartItemService {
    CartItem updateCartItem(CartItem cartItem);

    void removeCartItem(Long userId,Long cartItemId);

    CartItem findCartItemById(Long userid,Long cartItemId);

}
