package com.rohan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO → IDENTITY (MySQL best)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Cart cart;

    @ManyToOne   // 👈 YE MISSING THA
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String size;
    private int quantity = 1;

    private Integer mrpPrice;
    private Integer sellingPrice;

    private Long userId;
}
