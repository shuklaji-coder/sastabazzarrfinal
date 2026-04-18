package com.rohan.service.imp;

import com.rohan.model.USER_ROLE;
import com.rohan.request.Loginrequest;
import com.rohan.response.AuthResponse;
import com.rohan.response.SignupRequest;

public interface AuthService {

    void sentLoginOtp(String email, USER_ROLE role);

    String createUser(SignupRequest req);

    AuthResponse signing(Loginrequest request) throws Exception;   // ✅ FIXED
}
