package com.rohan.service.imp;



import com.rohan.Repository.CouponRepository;

import com.rohan.Repository.CartRepository;

import com.rohan.model.Cart;

import com.rohan.model.Coupon;

import com.rohan.model.User;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;



import java.time.LocalDate;

import java.util.List;

import java.util.Optional;



@Service

@RequiredArgsConstructor

public class CouponServiceImpl implements CouponService {



    private final CouponRepository couponRepository;

    private final CartRepository cartRepository;



    @Override

    @Transactional

    public Cart applyCoupon(String code, double orderValue, User user) {



        Coupon coupon = couponRepository.findByCode(code)

                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));



        // Validate coupon

        if (!coupon.isActive()) {

            throw new RuntimeException("Coupon is not active");

        }



        LocalDate today = LocalDate.now();

        if (today.isBefore(coupon.getValidityStartDate()) || today.isAfter(coupon.getValidityEndDate())) {

            throw new RuntimeException("Coupon has expired");

        }



        if (orderValue < coupon.getMinimumOrdervalue()) {

            throw new RuntimeException("Order value is below minimum required for this coupon");

        }



        if (coupon.getUsedByUsers().contains(user)) {

            throw new RuntimeException("You have already used this coupon");

        }



        // Get user's cart

        Cart cart = cartRepository.findByUser(user)

                .orElseThrow(() -> new RuntimeException("Cart not found"));

        

        // Apply coupon discount

        double discountAmount = orderValue * (coupon.getDiscountPercentage() / 100);

        double newTotal = orderValue - discountAmount;

        

        // Update cart with coupon info

        cart.setTotalSellingPrice(newTotal);

        cart.setCouponcode(coupon.getCode());

        cart.setDiscount((int) discountAmount);



        // Add user to used by users

        coupon.getUsedByUsers().add(user);

        couponRepository.save(coupon);

        

        return cartRepository.save(cart);

    }



    @Override

    @Transactional

    public Cart removeCoupon(String code, User user) {

        

        Coupon coupon = couponRepository.findByCode(code)

                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));

        

        // Get user's cart

        Cart cart = cartRepository.findByUser(user)

                .orElseThrow(() -> new RuntimeException("Cart not found"));

        

        // Check if this coupon is applied to cart

        if (cart.getCouponcode() == null || !cart.getCouponcode().equals(code)) {

            throw new RuntimeException("This coupon is not applied to your cart");

        }

        

        // Remove coupon and restore original price

        double discountedTotal = cart.getTotalSellingPrice();

        double discountAmount = cart.getDiscount();

        double originalTotal = discountedTotal + discountAmount;

        

        cart.setTotalSellingPrice(originalTotal);

        cart.setCouponcode(null);

        cart.setDiscount(0);

        

        // Remove user from used by users (optional - depends on business logic)

        // coupon.getUsedByUsers().remove(user);

        // couponRepository.save(coupon);

        

        return cartRepository.save(cart);

    }



    @Override

    public Coupon findCouponById(Coupon coupon) {

        return couponRepository.findById(coupon.getId())

                .orElseThrow(() -> new RuntimeException("Coupon not found with id: " + coupon.getId()));

    }



    @Override

    public List<Coupon> findAllCoupons() {

        return couponRepository.findAll();

    }



    @Override

    @Transactional

    public void deleteCoupon(Long id) {

        Coupon coupon = couponRepository.findById(id)

                .orElseThrow(() -> new RuntimeException("Coupon not found with id: " + id));

        

        couponRepository.delete(coupon);

    }

}