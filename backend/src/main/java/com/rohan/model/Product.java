package com.rohan.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    private String description;
    private int sellingPrice;
    private int mrpPrice;
    private int discountPercent;




    private String color;
    private String brand;
    private int quantity;

    @ElementCollection
    private List<String> images= new ArrayList<>();

    private int numRatings;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Seller seller;


    private LocalDateTime createdAt;

    private String sizes;

    @OneToMany(mappedBy="product",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Reviev> revievs= new ArrayList<>();






}
