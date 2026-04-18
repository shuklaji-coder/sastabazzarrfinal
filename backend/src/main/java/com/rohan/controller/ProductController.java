package com.rohan.controller;

import com.rohan.exceptions.ProductException;
import com.rohan.model.Product;
import com.rohan.service.imp.ProductService;
import com.rohan.service.imp.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final SellerService sellerService;

    // ✅ GET PRODUCT BY ID
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long productId
    ) throws ProductException {

        return ResponseEntity.ok(
                productService.findProductById(productId)
        );
    }

    // ✅ SEARCH PRODUCT
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProduct(
            @RequestParam(required = false) String query
    ) {

        return ResponseEntity.ok(
                productService.searchProduct(query)
        );
    }

    // ✅ GET ALL PRODUCTS (FILTER)
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(

            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String stock,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "50") Integer pageSize

    ) {

        return ResponseEntity.ok(
                productService.getAllProduct(
                        category,
                        brand,
                        color,
                        size,
                        minPrice,
                        maxPrice,
                        minDiscount,
                        sort,
                        stock,
                        pageNumber,
                        pageSize
                )
        );
    }
}