package com.rohan.model;

import lombok.Data;

import java.util.List;

@Data
public class Home {
    private List<HomeCategory> categories;
     private List<HomeCategory>shopbycategories;
     private List<HomeCategory>electroniccategories;
     private List<HomeCategory>dealcategories;

     private List <Deal> deals;


}
