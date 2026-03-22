package com.rohan.service.imp;

import com.rohan.model.SelllerReport ;
import com.rohan.model.SelllerReport;

public interface SellerReportService {

    SelllerReport getSellerReport(String sellerId);
    SelllerReport updateSellerReport(SelllerReport  sellerReport);
}
