package com.rohan.service.imp;

import com.rohan.Config.JwtProvider;
import com.rohan.Repository.UserRepository;
import com.rohan.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceimpl implements UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromToken(jwt);
        return findUserByEmail(email);
    }

    @Override
    public User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found with email " + email);
        }

        return user;
    }

    @Override
    public User addAddress(User user, com.rohan.model.Address address) {
        user.getAddresses().add(address);
        return userRepository.save(user);
    }
}