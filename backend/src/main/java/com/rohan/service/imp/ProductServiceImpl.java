package com.rohan.service.imp;

import com.rohan.Repository.CategoryRepository;

import com.rohan.Repository.ProductRepository;
import com.rohan.exceptions.ProductException;
import com.rohan.model.Category;
import com.rohan.model.Product;
import com.rohan.model.Seller;
import com.rohan.request.createProductRequest;
import com.rohan.service.imp.ProductService;

import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // ================= CREATE PRODUCT =================
    @Override
    public Product createProduct(createProductRequest req, Seller seller) {

        Category category1 = getOrCreateCategory(req.getCategory(), 1, null);
        Category category2 = req.getCategory2() != null && !req.getCategory2().getName().isEmpty() 
                ? getOrCreateCategory(req.getCategory2(), 2, category1) : category1;
        Category category3 = req.getCategory3() != null && !req.getCategory3().getName().isEmpty() 
                ? getOrCreateCategory(req.getCategory3(), 3, category2) : category2;

        int discountPercentage = calculateDiscount(req.getMrpPrice(), req.getSellingPrice());

        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category3);
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setSellingPrice(req.getSellingPrice());
        product.setMrpPrice(req.getMrpPrice());
        product.setColor(req.getColor());
        product.setBrand(req.getBrand());
        product.setQuantity(req.getQuantity());
        product.setSizes(req.getSizes());
        product.setImages(req.getImages());
        product.setDiscountPercent(discountPercentage);
        product.setCreatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    // ================= UPDATE PRODUCT =================
    @Override
    public Product updateProduct(Long productId, createProductRequest req) throws ProductException {

        Product product = findProductById(productId);

        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setSellingPrice(req.getSellingPrice());
        product.setMrpPrice(req.getMrpPrice());
        product.setImages(req.getImages());
        product.setDiscountPercent(
                calculateDiscount(req.getMrpPrice(), req.getSellingPrice())
        );

        return productRepository.save(product);
    }

    // ================= DELETE PRODUCT =================
    @Override
    public void deleteProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        productRepository.delete(product);
    }

    // ================= FIND BY ID =================
    @Override
    public Product findProductById(Long productId) throws ProductException {
        return productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductException("Product not found with id: " + productId));
    }

    @Override
    public List<Product> searchProduct(String query) {
        return productRepository.searchProduct(query);
    }

    @Override
    public Page<Product> getAllProduct(String category, String brand, String color, String size, Integer minPrice, Integer maxPrice, Integer minDiscount, String sort, String stock, Integer pageNumber, Integer pageSize) {
        Specification<Product> spec = (root, queryBuilder, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.isEmpty()) {
                Join<Product, Category> categoryJoin = root.join("category");
                Join<Category, Category> parentCategoryJoin = categoryJoin.join("parentCategory", JoinType.LEFT);
                Join<Category, Category> grandparentCategoryJoin = parentCategoryJoin.join("parentCategory", JoinType.LEFT);
                
                predicates.add(cb.or(
                        cb.equal(categoryJoin.get("categoryId"), category),
                        cb.equal(categoryJoin.get("name"), category),
                        cb.equal(parentCategoryJoin.get("categoryId"), category),
                        cb.equal(parentCategoryJoin.get("name"), category),
                        cb.equal(grandparentCategoryJoin.get("categoryId"), category),
                        cb.equal(grandparentCategoryJoin.get("name"), category)
                ));
            }

            if (brand != null && !brand.isEmpty()) {
                predicates.add(cb.equal(root.get("brand"), brand));
            }

            if (color != null && !color.isEmpty()) {
                predicates.add(cb.equal(root.get("color"), color));
            }

            if (size != null && !size.isEmpty()) {
                predicates.add(cb.equal(root.get("sizes"), size));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        root.get("sellingPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(
                        root.get("sellingPrice"), maxPrice));
            }

            if (minDiscount != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        root.get("discountPercent"), minDiscount));
            }

            if (stock != null && !stock.isEmpty()) {
                if (stock.equalsIgnoreCase("in_stock")) {
                    predicates.add(cb.greaterThan(root.get("quantity"), 0));
                } else if (stock.equalsIgnoreCase("out_of_stock")) {
                    predicates.add(cb.equal(root.get("quantity"), 0));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sorting = Sort.by(Sort.Direction.DESC, "id");

        if ("price_low".equalsIgnoreCase(sort) || "price-low".equalsIgnoreCase(sort)) {
            sorting = Sort.by("sellingPrice").ascending();
        } else if ("price_high".equalsIgnoreCase(sort) || "price-high".equalsIgnoreCase(sort)) {
            sorting = Sort.by("sellingPrice").descending();
        }

        int page = (pageNumber != null && pageNumber >= 0) ? pageNumber : 0;
        int sizeLimit = (pageSize != null && pageSize > 0) ? pageSize : 10;

        Pageable pageable = PageRequest.of(page, sizeLimit, sorting);

        return productRepository.findAll(spec, pageable);
    }

  
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    // ================= SELLER PRODUCTS =================
    public List<Product> getProductBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    // ================= HELPER METHODS =================
    private Category getOrCreateCategory(Category category, int level, Category parent) {

        if (category == null) {
            return null;
        }

        Category existingCategory = categoryRepository.findByCategoryId(category.getCategoryId());

        if (existingCategory == null) {
            category.setLevel(level);
            category.setParentCategory(parent);
            existingCategory = categoryRepository.save(category);
        }

        return existingCategory;
    }

    private int calculateDiscount(int mrpPrice, int sellingPrice) {

        if (mrpPrice <= 0) {
            throw new IllegalArgumentException("MRP must be greater than 0");
        }

        if (sellingPrice > mrpPrice) {
            throw new IllegalArgumentException("Selling price cannot be greater than MRP");
        }

        double discount = mrpPrice - sellingPrice;
        return (int) ((discount / mrpPrice) * 100);
    }
}