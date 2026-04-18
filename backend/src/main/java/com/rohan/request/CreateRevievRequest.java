package com.rohan.request;

import lombok.Data;

import java.util.List;
@Data
public class CreateRevievRequest {


    private String revievText;
    private double revievRating;
    private List<String> Productimages;
}
