package com.rohan.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String email;
    private String fullName;
    private String mobile;
    private String password;
    private String otp;


}
