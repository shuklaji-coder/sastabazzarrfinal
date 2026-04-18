package com.rohan.service.imp;

import com.rohan.model.Product;
import com.rohan.model.User;
import com.rohan.model.Wishlist;

public interface Wishlistservice {

    Wishlist createWishlist(User user);
    Wishlist getWishlistByUserId(User user);

    Wishlist addProductToWishlist(User user, Product product);
}
