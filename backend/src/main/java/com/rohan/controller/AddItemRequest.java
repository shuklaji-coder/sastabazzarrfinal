package com.rohan.controller;

import lombok.Data;

@Data
public class AddItemRequest {
    private String size;
    private int quantity;
    private Long productId;
}