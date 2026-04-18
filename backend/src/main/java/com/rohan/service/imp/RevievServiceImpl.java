package com.rohan.service.imp;

import com.rohan.Repository.RevievRepository;
import com.rohan.Repository.ProductRepository;
import com.rohan.model.Product;
import com.rohan.model.Reviev;
import com.rohan.model.User;
import com.rohan.request.CreateRevievRequest;
import com.stripe.model.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevievServiceImpl implements RevievService {

    private final RevievRepository revievRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public Reviev createReview(CreateRevievRequest req, User user, Product product) {

        Reviev reviev = new Reviev();
        reviev.setProduct(product);
        reviev.setUser(user);
        reviev.setRevievText(req.getRevievText());
        reviev.setRevievRating(req.getRevievRating());
        reviev.setProductImages(req.getProductimages());
        reviev.setCreatedAt(LocalDateTime.now());

        Reviev savedReviev = revievRepository.save(reviev);

        // Add review to product's reviews list
        product.getRevievs().add(savedReviev);
        productRepository.save(product);

        return savedReviev;
    }

    @Override
    public List<Reviev> getRevievByProduct(Long productId) {
        return revievRepository.findByProductId(productId);
    }

    @Override
    @Transactional
    public Reviev updateReviev(Long revievId, String revievText, double revievRating, Long userId) {
       Reviev reviev = getRevievById(revievId);
       
       if (!reviev.getUser().getId().equals(userId)) {
           throw new RuntimeException("You can only update your own reviews");
       }
       
       reviev.setRevievText(revievText);
       // Note: Reviev model doesn't have rating field, you might need to add it
       // reviev.setRevievRating(revievRating);
       
       return revievRepository.save(reviev);
    }

    @Override
    @Transactional
    public void DeleteReviev(Long revievId, Long userId) {
        Reviev reviev = getRevievById(revievId);
        
        if (!reviev.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        
        // Remove review from product's reviews list
        Product product = reviev.getProduct();
        product.getRevievs().remove(reviev);
        productRepository.save(product);
        
        revievRepository.delete(reviev);
    }

    @Override
    public Reviev getRevievById(Long revievId) {
        return revievRepository.findById(revievId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + revievId));
    }

    // Additional utility methods
    public List<Reviev> getRevievByUser(Long userId) {
        return revievRepository.findByUserId(userId);
    }

    public List<Reviev> getAllRevievs() {
        return revievRepository.findAll();
    }

    public Long getTotalRevievCount() {
        return revievRepository.count();
    }

    public Long getRevievCountByProduct(Long productId) {
        return revievRepository.countByProductId(productId);
    }

    @Transactional
    public Reviev addRevievImages(Long revievId, List<String> images, Long userId) {
        Reviev reviev = getRevievById(revievId);
        
        if (!reviev.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only add images to your own reviews");
        }
        
        reviev.getProductImages().addAll(images);
        return revievRepository.save(reviev);
    }

    @Transactional
    public Reviev removeRevievImages(Long revievId, List<String> images, Long userId) {
        Reviev reviev = getRevievById(revievId);
        
        if (!reviev.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only remove images from your own reviews");
        }
        
        reviev.getProductImages().removeAll(images);
        return revievRepository.save(reviev);
    }
}
