package com.rohan.service.imp;

import com.rohan.model.Cart;
import com.rohan.model.Coupon;
import com.rohan.model.User;

import java.util.List;

public interface CouponService {

    Cart applyCoupon(String code, double orderValue, User user);
    Cart removeCoupon(String code, User user);
     Coupon findCouponById(Coupon coupon);
     List<Coupon> findAllCoupons();
     void deleteCoupon(Long id);





}
