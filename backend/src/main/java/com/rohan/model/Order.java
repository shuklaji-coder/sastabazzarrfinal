package com.rohan.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")   // 👈 VERY IMPORTANT
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User user;

    private Long sellerId;

    @OneToMany(mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @ManyToOne
    private Address shippingAddress;

    @Embedded
    private PaymentDetails paymentDetails = new PaymentDetails();

    private double totalMrpPrice;
    private Integer totalSellingPrice;
    private Integer discount;

    private OrderStatus orderStatus;

    private int totalItem;

    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime orderDate = LocalDateTime.now();
    private LocalDateTime deliverDate = orderDate.plusDays(7);
}
