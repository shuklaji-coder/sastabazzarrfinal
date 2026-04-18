package com.rohan.model;

import lombok.Data;

@Data

public class PaymentDetails {
    private String paymentId;
    private String razorpayPaymentLinkId;
    private  String razorpayPaymentLinkRefrenceId;
    private String razorpayLinkStatus;
    private String razorpayPaymentIdZWSP;
    private PaymentStatus status;

}
