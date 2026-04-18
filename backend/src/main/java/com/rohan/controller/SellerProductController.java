package com.rohan.controller;

import com.rohan.exceptions.ProductException;
import com.rohan.model.Product;
import com.rohan.model.Seller;
import com.rohan.request.createProductRequest;
import com.rohan.service.imp.ProductService;
import com.rohan.service.imp.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers/products")
public class SellerProductController {

    private final ProductService productService;
    private final SellerService sellerService;

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody createProductRequest req,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        
        Seller seller = sellerService.getSellerProfile(jwt);
        Product product = productService.createProduct(req, seller);
        return ResponseEntity.status(201).body(product);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestBody createProductRequest req
    ) throws ProductException {
        
        Product product = productService.updateProduct(productId, req);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long productId
    ) throws ProductException {
        
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Product>> getSellerProducts(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        
        Seller seller = sellerService.getSellerProfile(jwt);
        List<Product> products = productService.getProductBySellerId(seller.getId());
        return ResponseEntity.ok(products);
    }
}