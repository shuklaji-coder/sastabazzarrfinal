package com.rohan.service.imp;

import com.rohan.Config.JwtProvider;
import com.rohan.Repository.CartRepository;
import com.rohan.Repository.UserRepository;
import com.rohan.Repository.VerificationCodeRepository;
import com.rohan.model.*;
import com.rohan.request.Loginrequest;
import com.rohan.response.AuthResponse;
import com.rohan.response.SignupRequest;
import com.rohan.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final JwtProvider jwtProvider;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final CustomUserImpl customUserImpl;

    @Value("${frontend.url}")
    private String frontend_url;

    // ================= SEND OTP =================
    @Override
    public void sentLoginOtp(String email, USER_ROLE role) {
        // Removed strict user checking here because this endpoint 
        // /auth/sent/login-signup-otp is used for BOTH login and signup.
        // If we strictly check userRepository here, new signups will fail.

        // Delete old OTP if exists
        VerificationCode existingCode =
                verificationCodeRepository.findByEmail(email);

        if (existingCode != null) {
            verificationCodeRepository.delete(existingCode);
        }

        String otp = OtpUtil.generateOtp();

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(email);
        verificationCode.setOtp(otp);
        verificationCodeRepository.save(verificationCode);

        emailService.sendVerificationOtpEmail(
                email,
                otp,
                "Sastaa Bazaar Login OTP",
                "Your OTP is: " + otp,
                frontend_url
        );
    }

    // ================= SIGNUP =================
    @Override
    public String createUser(SignupRequest req) {

        VerificationCode verificationCode =
                verificationCodeRepository.findByEmail(req.getEmail());

        if (verificationCode == null ||
                !verificationCode.getOtp().equals(req.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        // OTP delete after success
        verificationCodeRepository.delete(verificationCode);

        if (userRepository.findByEmail(req.getEmail()) != null) {
            throw new RuntimeException("User already exists");
        }

        User createdUser = new User();
        createdUser.setEmail(req.getEmail());
        createdUser.setFullname(req.getFullName());
        createdUser.setMobile(req.getMobile());
        createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
        createdUser.setPassword(
                passwordEncoder.encode(req.getPassword())
        );

        userRepository.save(createdUser);

        // Create cart automatically
        Cart cart = new Cart();
        cart.setUser(createdUser);
        cartRepository.save(cart);

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(
                new SimpleGrantedAuthority(
                        createdUser.getRole().name()
                )
        );

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        createdUser.getEmail(),
                        null,
                        authorities
                );

        return jwtProvider.generateToken(authentication);
    }

    // ================= LOGIN WITH OTP =================
    @Override
    public AuthResponse signing(Loginrequest request) throws Exception {

        // First check if user exists, if not it's a signup flow
        User existingUser = userRepository.findByEmail(request.getEmail());
        
        if (existingUser == null) {
            // New user - signup flow
            throw new BadCredentialsException("User not found. Please signup first.");
        }

        // Existing user - login flow
        VerificationCode verificationCode =
                verificationCodeRepository.findByEmail(request.getEmail());

        if (verificationCode == null ||
                !verificationCode.getOtp().equals(request.getOtp())) {
            throw new BadCredentialsException("Wrong OTP");
        }

        // OTP delete after successful login
        verificationCodeRepository.delete(verificationCode);

        // Create authentication for existing user
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(existingUser.getRole().name()));

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        existingUser.getEmail(),
                        null,
                        authorities
                );

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setMessage("Login successful");
        response.setRole(existingUser.getRole());

        return response;
    }

    private Authentication authenticate(String email, String otp) throws Exception {

        UserDetails userDetails =
                customUserImpl.loadUserByUsername(email);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid Email");
        }

        VerificationCode verificationCode =
                verificationCodeRepository.findByEmail(email);

        if (verificationCode == null ||
                !verificationCode.getOtp().equals(otp)) {
            throw new BadCredentialsException("Wrong OTP");
        }

        // OTP delete after successful login
        verificationCodeRepository.delete(verificationCode);

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }
}