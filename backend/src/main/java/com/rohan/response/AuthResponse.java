package com.rohan.response;

import com.rohan.model.USER_ROLE;
import lombok.Data;

@Data
public class AuthResponse {

    private String jwt;
    private String message;
    private USER_ROLE role;
}
