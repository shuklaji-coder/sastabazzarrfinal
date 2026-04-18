package com.rohan.service.imp;

import com.razorpay.PaymentLink;
import com.rohan.model.Order;
import com.rohan.model.PaymentOrder;
import com.rohan.model.User;


import java.util.Set;

public interface PaymentService {

    PaymentOrder createOrder(User user, Set<Order> orders);

    PaymentOrder getPaymentOrderById(String orderId);

    PaymentOrder getPaymentOrderByPaymentId(String orderId);

    Boolean ProceedPaymentOrder(PaymentOrder paymentOrder,
                                String paymentId,
                                String paymentLinkId);

    PaymentLink createRazorpayPaymentLink(User user, Long amount, Long orderId);

    String createStripePaymentLink(User user, Long amount, Long orderId);
}