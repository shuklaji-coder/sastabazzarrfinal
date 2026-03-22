package com.rohan.service.imp;

import com.rohan.model.Cart;
import com.rohan.model.CartItem;
import com.rohan.model.Product;
import com.rohan.model.User;

public interface CartService {

    public CartItem addCartItem(

          User user,
          Product product,
          String size,
          int quantity
    );
    public Cart findUserCart(User user);

}
