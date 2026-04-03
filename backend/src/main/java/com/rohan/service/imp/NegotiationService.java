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
                .timeout(Duration.ofSeconds(5))
                .doOnSuccess(response -> logger.info("Received ML API response: {}", response))
                .onErrorResume(e -> {
                    logger.error("ML API failed or timed out: {}. Using fallback rules.", e.getMessage());
                    return Mono.just(getFallbackResponse(request));
                });
    }

    private NegotiationResponseDTO getFallbackResponse(NegotiationRequestDTO req) {
        double minThreshold = req.getOriginalPrice() * (1 - req.getDiscountRate());
        NegotiationResponseDTO response = new NegotiationResponseDTO();
        
        if (req.getUserOffer() >= minThreshold) {
            response.setDealStatus("accept");
            response.setAiCounterOffer((int) Math.round(req.getUserOffer()));
            response.setMessage("Bhai kya baat hai, chalo done karte hain! (Fallback)");
        } else if (req.getRoundNumber() > 5 && req.getUserOffer() < minThreshold * 0.80) {
            response.setDealStatus("reject");
            response.setAiCounterOffer((int) Math.round(req.getOriginalPrice()));
            response.setMessage("Arre sir, is daam me possible nahi hai. Maaf karo. (Fallback)");
        } else {
            response.setDealStatus("counter");
            double counter = req.getOriginalPrice() * 0.85 - (req.getRoundNumber() * req.getOriginalPrice() * 0.03);
            counter = Math.max(counter, minThreshold); 
            int finalCounter = (int) (Math.round(counter / 10.0) * 10); 
            response.setAiCounterOffer(finalCounter);
            response.setMessage("System slow hai, " + finalCounter + " me lelo. (Fallback)");
        }
        return response;
    }
}
