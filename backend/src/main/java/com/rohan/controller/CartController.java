package com.rohan.controller;

import com.rohan.exceptions.ProductException;
import com.rohan.model.Cart;
import com.rohan.model.CartItem;
import com.rohan.model.Product;
import com.rohan.model.User;
import com.rohan.response.ApiResponse;
import com.rohan.service.imp.CartItemService;
import com.rohan.service.imp.CartService;
import com.rohan.service.imp.ProductService;
import com.rohan.service.imp.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserService userService;
    private final ProductService productService;

    // ------------------- FIND USER CART -------------------

    @GetMapping
    public ResponseEntity<Cart> findUserCartHandler(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Cart cart = cartService.findUserCart(user);

        return new ResponseEntity<Cart>(cart, HttpStatus.OK);
    }


    // ------------------- ADD ITEM TO CART -------------------

    @PutMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(
            @RequestBody AddItemRequest req,
            @RequestHeader("Authorization") String jwt)
            throws ProductException, Exception {

        User user = userService.findUserByJwtToken(jwt);

        Product product = productService.findProductById(req.getProductId());

        CartItem item = cartService.addCartItem(
                user,
                product,
                req.getSize(),
                req.getQuantity()
        );

        ApiResponse res = new ApiResponse();
        res.setMessage("Item Added To Cart Successfully");

        return new ResponseEntity<>(item, HttpStatus.ACCEPTED);
    }


    // ------------------- DELETE CART ITEM -------------------

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItemHandler(
            @PathVariable Long cartItemId,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        cartItemService.removeCartItem(user.getId(), cartItemId);

        ApiResponse res = new ApiResponse();
        res.setMessage("Item Remove From Cart");

        return new ResponseEntity<ApiResponse>(res, HttpStatus.ACCEPTED);
    }

    // ------------------- UPDATE CART ITEM -------------------

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItemHandler(
            @PathVariable Long cartItemId,
            @RequestBody CartItem cartItem,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        // Set the cart item ID and ensure it belongs to the user
        cartItem.setId(cartItemId);
        
        CartItem updatedItem = cartItemService.updateCartItem(cartItem);

        return new ResponseEntity<>(updatedItem, HttpStatus.OK);
    }

}