package com.rohan.service.imp;

import com.rohan.Repository.SellerReportRepository;
import com.rohan.Repository.SellerRepository;
import com.rohan.model.SelllerReport;
import com.rohan.model.Seller;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerServiceReportImpl implements SellerReportService {

    private final SellerReportRepository sellerReportRepository;
    private final SellerRepository sellerRepository;

    @Override
    public SelllerReport getSellerReport(String sellerId) {

        SelllerReport sr = sellerReportRepository.findBySellerId(Long.parseLong(sellerId));

        if (sr == null) {
            Seller seller = sellerRepository.findById(Long.parseLong(sellerId))
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
            SelllerReport newReport = new SelllerReport();
            newReport.setSeller(seller);   // ✅ Use setSeller instead of setSellerId
            return sellerReportRepository.save(newReport);
        }

        return sr;
    }

    @Override
    public SelllerReport updateSellerReport(SelllerReport sellerReport) {
        return sellerReportRepository.save(sellerReport);
    }
}