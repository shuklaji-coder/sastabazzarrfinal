package com.rohan.request;

import lombok.Data;

@Data
public class LoginOtpRequest {

   private String email;
  private   String otp;
  private   String role;

    
}
