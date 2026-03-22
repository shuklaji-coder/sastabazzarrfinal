package com.rohan.service.imp;

import com.rohan.model.User;

public interface UserService {

     User findUserByJwtToken(String jwt) throws Exception;
     User findUserByEmail(String email);
     User addAddress(User user, com.rohan.model.Address address);
}
