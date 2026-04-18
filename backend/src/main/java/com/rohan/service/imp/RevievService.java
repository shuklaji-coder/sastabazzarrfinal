package com.rohan.service.imp;

import com.rohan.model.Product;
import com.rohan.model.Reviev;
import com.rohan.model.User;
import com.rohan.request.CreateRevievRequest;

import java.util.List;

public interface RevievService {
    Reviev createReview(CreateRevievRequest req,
                        User user ,
                        Product product);
   List<Reviev> getRevievByProduct(Long productId);
   
   Reviev updateReviev(Long revievId,String revievText,double revievRating,Long userId);


   void DeleteReviev(Long revievId,Long userId);

   Reviev getRevievById(Long revievId);


}
