package com.rohan.Repository;

import com.rohan.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.rohan.model.User;

public interface CartRepository  extends JpaRepository<Cart,Long> {

    Cart findByUserId(Long id);
    
    Optional<Cart> findByUser(User user);
}
