package com.rohan.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class NegotiationResponseDTO {
    
    @JsonProperty("ai_counter_offer")
    private Integer aiCounterOffer;
    
    @JsonProperty("deal_status")
    private String dealStatus;
    
    private String message;
}
