package com.rohan.controller;

import com.rohan.Repository.VerificationCodeRepository;
import com.rohan.model.*;
import com.rohan.request.Loginrequest;
import com.rohan.response.AuthResponse;
import com.rohan.service.imp.AuthService;
import com.rohan.service.imp.EmailService;
import com.rohan.service.imp.ProductService;
import com.rohan.service.imp.SellerService;
import com.rohan.service.imp.SellerReportService;
import com.rohan.utils.OtpUtil;
import com.rohan.Config.Jwt_Constant;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers")
public class SellerController {

    private final SellerService sellerService;
    private final AuthService authService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final ProductService productService;
    private final SellerReportService sellerReportService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginSeller(
            @RequestBody VerificationCode req
    ) throws Exception {

        String email = req.getEmail();
        String otp = req.getOtp();

        VerificationCode verificationCode =
                verificationCodeRepository.findByEmail(email);

        if (verificationCode == null ||
                !verificationCode.getOtp().equals(otp)) {
            throw new Exception("Wrong OTP...");
        }

        Loginrequest loginrequest = new Loginrequest();
        loginrequest.setEmail("seller_" + email);
        loginrequest.setOtp(otp);

        AuthResponse authResponse = authService.signing(loginrequest);

        return ResponseEntity.ok(authResponse);
    }

    @PatchMapping("/verify/{otp}")
    public ResponseEntity<Seller> verifySellerEmail(
            @PathVariable String otp) throws Exception {

        VerificationCode verificationCode =
                verificationCodeRepository.findByOtp(otp);

        if (verificationCode == null ||
                !verificationCode.getOtp().equals(otp)) {

            throw new Exception("wrong otp...");
        }

        Seller seller = sellerService.verifyEmail(
                verificationCode.getEmail(), otp);

        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Seller> createSeller(
            @RequestBody Seller seller) throws Exception {

        Seller savedSeller = sellerService.createSeller(seller);

        String otp = OtpUtil.generateOtp();

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(seller.getEmail());
        verificationCode.setOtp(otp);
        verificationCodeRepository.save(verificationCode);

        String subject = "Sastaa Baaazaarr Email Verification Code";
        String text = "Welcome to sastaaa bazzaaar , verify your account using this link ";
        String frontend_url = "http://localhost:3000/verify-seller/";

        emailService.sendVerificationOtpEmail(
                seller.getEmail(), verificationCode.getOtp(),
                subject,
                text,
                frontend_url
        );

        return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(
            @PathVariable Long id) throws Exception {

        Seller seller = sellerService.getSellerById(id);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<Seller> getSellerByJwt(
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @GetMapping("/report")
    public ResponseEntity<SelllerReport> getSellerReport(
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        String email = getEmailFromJwtToken(jwt);
        Seller seller = sellerService.getSellerByEmail(email);
        SelllerReport report = sellerReportService.getSellerReport(seller.getId().toString());

        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers(
            @RequestParam(required = false) AccountStatus status) {

        List<Seller> sellers =
                sellerService.getAllSellers(status);

        return ResponseEntity.ok(sellers);
    }

    @PatchMapping
    public ResponseEntity<Seller> updateSeller(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Seller seller) throws Exception {

        Seller profile = sellerService.getSellerProfile(jwt);
        Seller updatedSeller = sellerService.updateSeller(profile.getId(), seller);
        return ResponseEntity.ok(updatedSeller);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) throws Exception {

        sellerService.deleteSeller(id);
        return ResponseEntity.noContent().build();
    }

    private String getEmailFromJwtToken(String jwt) {
        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
            
            try {
                SecretKey key = Keys.hmacShaKeyFor(Jwt_Constant.SECRET_KEY.getBytes());
                
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();
                
                return claims.get("email").toString();
            } catch (Exception e) {
                throw new RuntimeException("Invalid JWT Token");
            }
        }
        throw new RuntimeException("JWT Token is required");
    }
}