package com.rohan.service.imp;

import com.rohan.request.NegotiationRequestDTO;
import com.rohan.response.NegotiationResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class NegotiationService {
    private final WebClient webClient;
    private static final Logger logger = LoggerFactory.getLogger(NegotiationService.class);

    public NegotiationService(@Value("${ml.service.url}") String mlServiceUrl) {
        this.webClient = WebClient.builder().baseUrl(mlServiceUrl).build();
    }

    public Mono<NegotiationResponseDTO> negotiate(NegotiationRequestDTO request) {
        logger.info("Sending negotiation request to ML API: {}", request);

        return this.webClient.post()
                .uri("/negotiate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(NegotiationResponseDTO.class)
                .timeout(Duration.ofSeconds(15))
                .doOnSuccess(response -> logger.info("Received ML API response: {}", response))
                .onErrorResume(e -> {
                    logger.error("ML API failed or timed out: {}. Using fallback rules.", e.getMessage());
                    return Mono.just(getFallbackResponse(request));
                });
    }

    public void warmup() {
        logger.info("Proactively warming up ML API (Health Check)...");
        this.webClient.get()
                .uri("/health")
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(10))
                .subscribe(
                    res -> logger.info("ML API Warm-up successful: {}", res),
                    err -> logger.warn("ML API Warm-up failed: {}", err.getMessage())
                );
    }

    private NegotiationResponseDTO getFallbackResponse(NegotiationRequestDTO req) {
        double minThreshold = Math.round(req.getOriginalPrice() * (1 - req.getDiscountRate()) / 10.0) * 10.0;
        NegotiationResponseDTO response = new NegotiationResponseDTO();
        
        if (req.getUserOffer() >= minThreshold || (minThreshold - req.getUserOffer()) / req.getOriginalPrice() <= 0.02) {
            response.setDealStatus("accept");
            response.setAiCounterOffer((int) Math.round(req.getUserOffer()));
            response.setMessage("Chalo sir, aapki khushi ke liye maan gaye! (Fallback)");
        } else if (req.getRoundNumber() >= 6) {
            response.setDealStatus("reject");
            response.setAiCounterOffer((int) Math.round(req.getOriginalPrice()));
            response.setMessage("Arre sir, is daam me possible nahi hai. Maaf karo. (Fallback)");
        } else {
            response.setDealStatus("counter");
            // Rule-based counter: start at 90% and drop by 2-3% each round, but stay above minThreshold
            double counter = req.getOriginalPrice() * 0.90 - (req.getRoundNumber() * req.getOriginalPrice() * 0.02);
            counter = Math.max(counter, minThreshold); 
            int finalCounter = (int) (Math.round(counter / 10.0) * 10); 
            response.setAiCounterOffer(finalCounter);
            
            if (req.getRoundNumber() == 1) {
                response.setMessage("Bhai starting mein hi itna kam? " + finalCounter + " mein done karte hain. (Fallback)");
            } else {
                response.setMessage("System thoda slow hai, par " + finalCounter + " last bhav hai mera. (Fallback)");
            }
        }
        return response;
    }
}
