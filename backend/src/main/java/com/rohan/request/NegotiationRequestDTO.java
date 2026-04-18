package com.rohan.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NegotiationRequestDTO {
    
    @NotNull
    @Min(0)
    @JsonProperty("original_price")
    private Double originalPrice;
    
    @NotNull
    @JsonProperty("discount_rate")
    private Double discountRate;
    
    @NotNull
    @Min(0)
    @JsonProperty("user_offer")
    private Double userOffer;
    
    @NotNull
    @Min(1)
    @JsonProperty("round_number")
    private Integer roundNumber;
    
    @NotNull
    private String category;
    
    @JsonProperty("prev_user_offer")
    private Double prevUserOffer;
    
    @JsonProperty("is_regular")
    private Integer isRegular;
    
    @JsonProperty("total_orders")
    private Integer totalOrders;
    
    @JsonProperty("tenure_days")
    private Integer tenureDays;
    
    @JsonProperty("market_condition")
    private String marketCondition = "normal";
}
