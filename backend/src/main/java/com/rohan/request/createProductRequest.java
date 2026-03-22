package com.rohan.request;

import com.rohan.model.Category;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
@Getter
@Setter
public class createProductRequest {

    private String title;
    private String description;
    private int mrpPrice;
    private int sellingPrice;
    private String color;
    private String brand;
    private int quantity;
    private String sizes;
    private List<String> images;
    private Category category;
    private Category category2;
    private Category category3;
}