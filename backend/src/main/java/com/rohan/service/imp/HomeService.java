package com.rohan.service.imp;

import com.rohan.model.Home;
import com.rohan.model.HomeCategory;
import com.rohan.model.HomeCategorySection;

import java.util.List;

public interface HomeService {
    
    Home getHomePageData();
    
    List<HomeCategory> getHomeCategoriesBySection(HomeCategorySection section);
    
    Home createHomePageData(List<HomeCategory> categories);
    
    Home updateHomePageData(Home home);
    
    void refreshHomeCategories();
    
    List<HomeCategory> getAllHomeCategories();
}
