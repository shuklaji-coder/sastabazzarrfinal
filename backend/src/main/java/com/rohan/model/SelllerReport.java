package com.rohan.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class SelllerReport {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    private Seller seller;

    private Long totalEarnings=0L;

    private Long totalSales=0l;
    private Long totalRefunds=0L;

    private Long totalTax=0L;



    private Integer totalOrders=0;

    private Integer cancelOrders=0;
    private Integer totalTransactions=0;


}
