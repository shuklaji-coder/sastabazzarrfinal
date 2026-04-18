package com.rohan.service.imp;

import com.rohan.model.AccountStatus;
import com.rohan.model.Seller;

import java.util.List;

public interface SellerService {

    Seller getSellerProfile(String jwt);
    Seller createSeller(Seller seller) throws Exception;

    Seller getSellerById(Long id) throws Exception;
    Seller getSellerByEmail(String email) throws Exception;
    List<Seller> getAllSellers(AccountStatus status);
    Seller updateSeller(Long id,Seller seller);
    void deleteSeller(Long id) throws Exception;
    Seller verifyEmail(String email ,String otp);
    Seller updateSellerAccountStatus(Long id,AccountStatus status);









}
