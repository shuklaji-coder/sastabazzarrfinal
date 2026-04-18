package com.rohan.controller;

import com.rohan.model.Reviev;
import com.rohan.model.User;
import com.rohan.request.CreateRevievRequest;
import com.rohan.response.ApiResponse;
import com.rohan.service.imp.ProductService;
import com.rohan.service.imp.RevievService;
import com.rohan.service.imp.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RevievController {

    private final RevievService revievService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping("/products/{productId}/reveivs")
    public List<Reviev> getRevievs(@PathVariable Long productId) {
        return revievService.getRevievByProduct(productId);
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Reviev> createReview(
            @RequestBody CreateRevievRequest req,
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        com.rohan.model.Product product = productService.findProductById(productId);

        Reviev review = revievService.createReview(req, user, product);
        return ResponseEntity.ok(review);
    }

    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<Reviev> updateReview(
            @RequestBody CreateRevievRequest req,
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Reviev review = revievService.updateReviev(
                reviewId,
                req.getRevievText(),
                req.getRevievRating(),
                user.getId()
        );

        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        revievService.DeleteReviev(reviewId, user.getId());

        ApiResponse res = new ApiResponse();
        res.setMessage("Review deleted successfully");

        return ResponseEntity.ok(res);
    }
}
