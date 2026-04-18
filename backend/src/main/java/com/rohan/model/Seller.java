package com.rohan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@JsonIgnoreProperties({
    "password", 
    "buisnessDetails", 
    "bankDetails",
    "hibernateLazyInitializer", 
    "handler"
})
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String sellerName;

    private String mobile;

    @Column(unique = true)
    private String email;

    private String password;

    @Embedded
    private BuisnessDetails buisnessDetails = new BuisnessDetails();

    @Embedded
    private BankDetails bankDetails = new BankDetails();

    @OneToOne(cascade = CascadeType.ALL)
    private Address pickupAddress = new Address();

    private String GSTIN;

    private USER_ROLE role = USER_ROLE.ROLE_SELLER;

    // ✅ FIXED HERE
    private Boolean isEmailVerified = false;

    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;
}