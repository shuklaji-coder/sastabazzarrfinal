package com.rohan.Repository;

import com.rohan.model.USER_ROLE;
import com.rohan.model.User;   // ✅ APNI ENTITY IMPORT KARO
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findByEmailAndRole(String email, USER_ROLE role);

}