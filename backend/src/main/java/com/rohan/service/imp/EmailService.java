package com.rohan.service.imp;

import com.rohan.model.Order;
import com.rohan.model.OrderItem;
import com.rohan.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final RestTemplate restTemplate;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.api.url}")
    private String brevoApiUrl;

    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text, String frontend_url) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'></head>");
        html.append("<body style='margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f7;'>");
        html.append("<div style='max-width:520px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.1);'>");
        html.append("<div style='background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:36px 24px;text-align:center;'>");
        html.append("<h1 style='color:#ffffff;margin:0;font-size:30px;font-weight:800;letter-spacing:1px;'>🛍️ SastaaBazaar</h1>");
        html.append("<p style='color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:13px;letter-spacing:0.5px;'>Your Smart Shopping Companion</p>");
        html.append("</div>");
        html.append("<div style='text-align:center;padding:36px 24px 20px;'>");
        html.append("<div style='width:64px;height:64px;background:linear-gradient(135deg,#e8f5e9,#c8e6c9);border-radius:50%;margin:0 auto 20px;line-height:64px;font-size:28px;'>🔐</div>");
        html.append("<h2 style='color:#1a1a2e;margin:0 0 8px;font-size:22px;font-weight:700;'>Verification Code</h2>");
        html.append("<p style='color:#666;margin:0 0 28px;font-size:14px;line-height:1.5;'>Aapka One-Time Password (OTP) neeche diya gaya hai.<br/>Ise kisi ke saath share na karein.</p>");
        html.append("<div style='display:inline-block;background:#f8f9fa;border:2px dashed #667eea;border-radius:12px;padding:18px 28px;'>");
        html.append("<span style='font-size:36px;font-weight:800;color:#1a1a2e;letter-spacing:14px;font-family:monospace;'>");
        html.append(otp);
        html.append("</span></div>");
        html.append("<p style='color:#999;margin:20px 0 0;font-size:12px;'>⏱️ Yeh OTP <strong>5 minutes</strong> ke liye valid hai</p>");
        html.append("</div>");
        html.append("<div style='padding:0 24px 24px;'>");
        html.append("<table style='width:100%;background:linear-gradient(135deg,#fff3e0,#fce4ec);border-radius:10px;border:1px solid #ffe0b2;' cellpadding='16' cellspacing='0'><tr><td>");
        html.append("<p style='margin:0 0 10px;font-size:13px;font-weight:700;color:#e65100;'>⚠️ Security Tips</p>");
        html.append("<p style='margin:3px 0;font-size:12px;color:#555;'>🔒 Yeh OTP sirf aapke liye hai, kisi ko na batayein</p>");
        html.append("<p style='margin:3px 0;font-size:12px;color:#555;'>📞 SastaaBazaar kabhi phone par OTP nahi maangta</p>");
        html.append("<p style='margin:3px 0;font-size:12px;color:#555;'>🚫 Agar aapne yeh request nahi ki, toh ignore karein</p>");
        html.append("</td></tr></table></div>");
        html.append("<div style='background:#f8f9fa;padding:20px 24px;text-align:center;border-top:1px solid #eee;'>");
        html.append("<p style='margin:0 0 6px;font-size:13px;color:#888;'>Thank you for choosing <strong>SastaaBazaar</strong>! 🛒</p>");
        html.append("<p style='margin:0 0 6px;font-size:11px;color:#bbb;'>Smart shopping, sasta prices — yahi hai hamara vaada</p>");
        html.append("<p style='margin:0;font-size:10px;color:#ccc;'>This is an automated email. Please do not reply.</p>");
        html.append("</div></div></body></html>");

        sendBrevoEmail(userEmail, subject, text, html.toString());
    }

    @Async
    public void sendOrderConfirmationEmail(User user, Set<Order> orders) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            log.warn("No email found for user: {}", user.getId());
            return;
        }

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'></head>");
        html.append("<body style='margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f7;'>");
        html.append("<div style='max-width:600px;margin:20px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>");
        html.append("<div style='background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 24px;text-align:center;'>");
        html.append("<h1 style='color:#ffffff;margin:0;font-size:28px;font-weight:800;'>SastaaBazaar</h1>");
        html.append("<p style='color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;'>Your Smart Shopping Companion</p>");
        html.append("</div>");
        html.append("<div style='text-align:center;padding:32px 24px 16px;'>");
        html.append("<div style='width:64px;height:64px;background:#e8f5e9;border-radius:50%;margin:0 auto 16px;line-height:64px;font-size:32px;'>✅</div>");
        html.append("<h2 style='color:#1a1a2e;margin:0 0 8px;font-size:24px;font-weight:700;'>Order Placed Successfully!</h2>");
        String name = (user.getFullname() != null && !user.getFullname().isEmpty()) ? user.getFullname() : "Customer";
        html.append("<p style='color:#666;margin:0;font-size:15px;'>Namaste <strong>").append(name).append("</strong>! Aapka order confirm ho gaya hai 🎉</p>");
        html.append("</div>");

        for (Order order : orders) {
            html.append("<div style='padding:0 24px 16px;'>");
            html.append("<table style='width:100%;background:#f8f9fa;border-radius:10px;border:1px solid #e9ecef;' cellpadding='16' cellspacing='0'><tr>");
            html.append("<td style='font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;'>Order ID<br/><span style='font-size:18px;font-weight:800;color:#1a1a2e;'>#").append(order.getId()).append("</span></td>");
            html.append("<td style='text-align:right;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;'>Total<br/><span style='font-size:18px;font-weight:800;color:#27ae60;'>₹").append(order.getTotalSellingPrice()).append("</span></td>");
            html.append("</tr></table>");

            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    String productTitle = (item.getProduct() != null) ? item.getProduct().getTitle() : "Product";
                    String imageUrl = (item.getProduct() != null && item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) ? item.getProduct().getImages().get(0) : "";
                    int price = item.getSellingPrice() != null ? item.getSellingPrice() : 0;
                    int mrp = item.getMrpPrice() != null ? item.getMrpPrice() : 0;

                    html.append("<table style='width:100%;border:1px solid #eee;border-radius:10px;margin-top:8px;' cellpadding='12' cellspacing='0'><tr>");
                    html.append("<td style='width:80px;vertical-align:top;'>");
                    if (!imageUrl.isEmpty()) {
                        html.append("<img src='").append(imageUrl).append("' alt='Product' style='width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid #eee;display:block;' />");
                    } else {
                        html.append("<div style='width:80px;height:80px;background:#f0f0f0;border-radius:8px;text-align:center;line-height:80px;font-size:28px;'>📦</div>");
                    }
                    html.append("</td><td style='vertical-align:top;'>");
                    html.append("<p style='margin:0 0 4px;font-size:14px;font-weight:600;color:#1a1a2e;'>").append(productTitle).append("</p>");
                    if (item.getSize() != null && !item.getSize().isEmpty()) {
                        html.append("<p style='margin:0 0 4px;font-size:12px;color:#888;'>Size: ").append(item.getSize()).append("</p>");
                    }
                    html.append("<span style='font-size:16px;font-weight:700;color:#1a1a2e;'>₹").append(price).append("</span>");
                    if (mrp > price) {
                        html.append(" <span style='font-size:12px;color:#999;text-decoration:line-through;'>₹").append(mrp).append("</span>");
                        int discount = ((mrp - price) * 100) / mrp;
                        html.append(" <span style='font-size:11px;color:#e74c3c;font-weight:700;background:#fde8e8;padding:2px 6px;border-radius:4px;'>").append(discount).append("% OFF</span>");
                    }
                    html.append("</td></tr></table>");
                }
            }
            html.append("</div>");
        }
        
        html.append("<div style='padding:0 24px 24px;'>");
        html.append("<table style='width:100%;background:linear-gradient(135deg,#e8f5e9,#e3f2fd);border-radius:10px;border:1px solid #c8e6c9;' cellpadding='20' cellspacing='0'><tr><td>");
        html.append("<p style='margin:0 0 12px;font-size:14px;font-weight:700;color:#2e7d32;'>📦 What's Next?</p>");
        html.append("<p style='margin:4px 0;font-size:13px;color:#555;'>✉️ Email & SMS confirmation sent</p>");
        html.append("<p style='margin:4px 0;font-size:13px;color:#555;'>📋 Order processing within 24 hours</p>");
        html.append("<p style='margin:4px 0;font-size:13px;color:#555;'>🚚 Tracking details will be shared</p>");
        html.append("<p style='margin:4px 0;font-size:13px;color:#555;'>🏠 Expected delivery in 5-7 days</p>");
        html.append("</td></tr></table></div>");
        html.append("<div style='text-align:center;padding:0 24px 32px;'>");
        html.append("<a href='http://localhost:5173/orders' style='display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;'>Track Your Order →</a>");
        html.append("</div>");
        html.append("<div style='background:#f8f9fa;padding:20px 24px;text-align:center;border-top:1px solid #eee;'>");
        html.append("<p style='margin:0 0 4px;font-size:13px;color:#888;'>Thank you for shopping with <strong>SastaaBazaar</strong>! 🛍️</p>");
        html.append("<p style='margin:0;font-size:11px;color:#bbb;'>This is an automated email. Please do not reply.</p>");
        html.append("</div></div></body></html>");

        Order order = orders.iterator().next();
        String subject = "✅ Order Confirmed! Your SastaaBazaar Order #" + order.getId();
        sendBrevoEmail(user.getEmail(), subject, "Your order is confirmed.", html.toString());
    }

    private void sendBrevoEmail(String toEmail, String subject, String textContent, String htmlContent) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.set("api-key", brevoApiKey);

            Map<String, Object> body = new HashMap<>();
            
            Map<String, String> sender = new HashMap<>();
            sender.put("email", "shuklarohan388@gmail.com");
            sender.put("name", "SastaaBazaar");
            body.put("sender", sender);

            List<Map<String, String>> toList = new ArrayList<>();
            Map<String, String> recipient = new HashMap<>();
            recipient.put("email", toEmail);
            toList.add(recipient);
            body.put("to", toList);

            body.put("subject", subject);
            body.put("textContent", textContent);
            body.put("htmlContent", htmlContent);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(brevoApiUrl, request, String.class);
            log.info("Email sent successfully using Brevo to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }
}
