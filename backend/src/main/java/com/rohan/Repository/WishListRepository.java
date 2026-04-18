package com.rohan.Repository;

import com.rohan.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishListRepository extends JpaRepository<Wishlist,Long>{
   Wishlist findByUserId(long userId);
}
