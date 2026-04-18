package com.rohan.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String paymentId;
    
    private String paymentLinkId;
    
    private Long amount;
    
    private PaymentOrderStatus status = PaymentOrderStatus.PENDING;

    private PaymentMethod paymentMethod;

    @ManyToOne
    private User user;

    @OneToMany
    private Set<Order> orders = new HashSet<>();
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
