package com.rohan.controller;

import com.rohan.model.Product;
import com.rohan.model.User;
import com.rohan.model.Wishlist;
import com.rohan.service.imp.ProductService;
import com.rohan.service.imp.UserService;
import com.rohan.service.imp.Wishlistservice;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishListCOntroller {

    private final Wishlistservice wishlistservice;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Wishlist> getWishlistByUserId(
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Wishlist wishlist = wishlistservice.getWishlistByUserId(user);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/add-product/{productId}")
    public ResponseEntity<Wishlist> addProductToWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        Product product = productService.findProductById(productId);
        User user = userService.findUserByJwtToken(jwt);

        Wishlist updatedWishlist =
                wishlistservice.addProductToWishlist(user, product);

        return ResponseEntity.ok(updatedWishlist);
    }
}