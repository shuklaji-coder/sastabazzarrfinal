package com.rohan.service.imp;

import com.rohan.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DealService {

List<Deal> getDeals();
Deal createDeal(Deal deal);
Deal updateDeal(Deal deal);
void deleteDeal(Deal deal);

}
