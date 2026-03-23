package com.rohan.service.imp;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailService emailService;
    
    // In-memory store: email -> {otp, timestamp}
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private static final long OTP_VALID_DURATION = 5 * 60 * 1000; // 5 minutes

    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        otpStorage.put(email, new OtpData(otp, System.currentTimeMillis()));
        
        emailService.sendVerificationOtpEmail(
            email, 
            otp, 
            "Your Verification OTP", 
            "Your OTP is: " + otp, 
            "https://subtle-gumdrop-648ce7.netlify.app"
        );
    }

    public boolean verifyOtp(String email, String otp) {
        if (!otpStorage.containsKey(email)) {
            return false;
        }

        OtpData otpData = otpStorage.get(email);
        long currentTime = System.currentTimeMillis();

        if (currentTime - otpData.timestamp() > OTP_VALID_DURATION) {
            otpStorage.remove(email); // expired
            return false;
        }

        if (otpData.otp().equals(otp)) {
            otpStorage.remove(email); // used
            return true;
        }

        return false;
    }

    private record OtpData(String otp, long timestamp) {}
}
