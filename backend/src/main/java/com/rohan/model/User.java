package com.rohan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode

public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // ✅ FIXED (small e)
    private String email;

    private String fullname;


    private String mobile;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Address> addresses = new java.util.ArrayList<>();


    @Enumerated(EnumType.STRING)
    private USER_ROLE role = USER_ROLE.ROLE_CUSTOMER;






    @ManyToMany
    @JsonIgnore
    private Set<Coupon> usedCoupons = new HashSet<>();

    public User() {}
}
