package com.rohan.service.imp;

import com.rohan.Repository.WishListRepository;
import com.rohan.model.Product;
import com.rohan.model.User;
import com.rohan.model.Wishlist;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl  implements Wishlistservice{
    private final WishListRepository wishListRepository;
    @Override
    public Wishlist createWishlist(User user) {
     Wishlist wishlist = new Wishlist();
     wishlist.setUser(user);
     return wishListRepository.save(wishlist);
    }

    @Override
    public Wishlist getWishlistByUserId(User user) {
        Wishlist wishlist= wishListRepository.findByUserId(user.getId());
        if(wishlist==null){
            wishlist=createWishlist(user);

        }
        return wishlist;
    }

    @Override
    public Wishlist addProductToWishlist(User user, Product product) {

        Wishlist wishlist = getWishlistByUserId(user);

        if(wishlist.getProducts().contains(product)){
       wishlist.getProducts().remove(product);

        }

        else wishlist.getProducts().add(product);
        return wishListRepository.save(wishlist);


    }
}
