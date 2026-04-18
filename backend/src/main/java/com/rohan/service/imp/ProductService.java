package com.rohan.service.imp;

import com.rohan.exceptions.ProductException;
import com.rohan.model.Product;
import com.rohan.model.Seller;
import com.rohan.request.createProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    Product findProductById(Long productId) throws ProductException;

    List<Product> searchProduct(String query);

    Page<Product> getAllProduct(
            String category,
            String brand,
            String color,
            String size,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber,
            Integer pageSize
    );
    
    Product createProduct(createProductRequest req, Seller seller);
    
    Product updateProduct(Long productId, createProductRequest req) throws ProductException;
    
    void deleteProduct(Long productId) throws ProductException;
    
    List<Product> getProductBySellerId(Long sellerId);
}