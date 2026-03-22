package com.rohan.response;

import com.rohan.model.Category;
import com.rohan.model.Seller;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    
    private Long id;
    private String title;
    private String description;
    private int sellingPrice;
    private int mrpPrice;
    private int discountPercent;
    private String color;
    private List<String> images;
    private int numRatings;
    private CategoryResponse category;
    private SellerResponse seller;
    private LocalDateTime createdAt;
    private String sizes;
    
    // Nested DTOs
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryResponse {
        private Long id;
        private String name;
        private String categoryId;
        private CategoryResponse parentCategory;
        private Integer level;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerResponse {
        private Long id;
        private String sellerName;
        private String mobile;
        private String email;
        private String GSTIN;
        private String role;
        private Boolean isEmailVerified;
        private String accountStatus;
    }
}
