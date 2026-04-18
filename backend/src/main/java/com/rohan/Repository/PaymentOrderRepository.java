package com.rohan.Repository;

import com.rohan.model.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

    Optional<PaymentOrder> findByPaymentId(String paymentId);
    
    PaymentOrder findByPaymentLinkId(String paymentLinkId);
}
