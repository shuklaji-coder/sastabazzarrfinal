package com.rohan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Reviev {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String revievText;

    @ElementCollection
    private List<String> productImages;

    @JsonIgnore
    @ManyToOne
    private Product product;

    @ManyToOne
    private User user;

    @Column(nullable = false)
    private double revievRating;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}


