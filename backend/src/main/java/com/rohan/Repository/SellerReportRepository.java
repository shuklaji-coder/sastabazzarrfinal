package com.rohan.Repository;

import com.rohan.model.SelllerReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerReportRepository extends JpaRepository<SelllerReport, Long> {

    SelllerReport findBySellerId(Long sellerId);

}