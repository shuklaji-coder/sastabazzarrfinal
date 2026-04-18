package com.rohan.Repository;

import com.rohan.model.AccountStatus;
import com.rohan.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller,Long> {
    Seller findByEmail(String email);

    List<Seller> findAllByAccountStatus(AccountStatus status);
}
