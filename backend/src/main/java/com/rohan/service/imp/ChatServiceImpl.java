package com.rohan.service.imp;

import com.rohan.Repository.OrderRepository;
import com.rohan.Repository.ProductRepository;
import com.rohan.model.Order;
import com.rohan.model.Product;
import com.rohan.request.ChatRequest;
import com.rohan.response.ChatResponse;
import com.rohan.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Default quick action chips
    private static final List<String> DEFAULT_ACTIONS = Arrays.asList(
            "🔥 Trending Products",
            "📦 Track My Order",
            "💰 Today's Deals",
            "🚚 Shipping Info",
            "🔄 Return Policy",
            "❓ Help"
    );

    // Category keywords mapping (Hindi + English)
    private static final Map<String, List<String>> CATEGORY_KEYWORDS = new LinkedHashMap<>();
    static {
        CATEGORY_KEYWORDS.put("shoes", Arrays.asList("shoes", "shoe", "sneakers", "footwear", "joote", "chappal", "sandal", "heels", "boots"));
        CATEGORY_KEYWORDS.put("phone", Arrays.asList("phone", "mobile", "smartphone", "iphone", "samsung", "realme", "oneplus", "vivo", "oppo", "redmi", "xiaomi"));
        CATEGORY_KEYWORDS.put("laptop", Arrays.asList("laptop", "notebook", "macbook", "computer", "pc", "dell", "hp", "lenovo", "asus"));
        CATEGORY_KEYWORDS.put("shirt", Arrays.asList("shirt", "tshirt", "t-shirt", "top", "kurta", "polo"));
        CATEGORY_KEYWORDS.put("watch", Arrays.asList("watch", "watches", "smartwatch", "ghadi"));
        CATEGORY_KEYWORDS.put("jeans", Arrays.asList("jeans", "pants", "trousers", "pant", "denim"));
        CATEGORY_KEYWORDS.put("dress", Arrays.asList("dress", "frock", "gown", "saree", "sari", "lehenga", "suit"));
        CATEGORY_KEYWORDS.put("bag", Arrays.asList("bag", "bags", "backpack", "purse", "handbag", "suitcase"));
        CATEGORY_KEYWORDS.put("electronics", Arrays.asList("electronics", "earbuds", "earphones", "headphones", "headphone", "speaker", "camera", "tablet", "tv", "television"));
    }

    @Override
    public ChatResponse processChatMessage(ChatRequest chatRequest) {
        String userMessage = chatRequest.getMessage().trim();
        String lowerMessage = userMessage.toLowerCase();

        // 1. Greeting Detection
        if (isGreeting(lowerMessage)) {
            return buildGreetingResponse();
        }

        // 2. Order Tracking
        if (isOrderQuery(lowerMessage)) {
            return handleOrderQuery(lowerMessage);
        }

        // 3. Product Search (natural language)
        if (isProductSearch(lowerMessage)) {
            return handleProductSearch(lowerMessage);
        }

        // 4. FAQ - Return/Refund
        if (containsAny(lowerMessage, "return", "refund", "replace", "exchange", "wapas", "vapas", "badalna")) {
            return buildFaqResponse(
                "🔄 **Return & Refund Policy**\n\n" +
                "✅ 7-day easy return on most items\n" +
                "✅ Free pickup from your doorstep\n" +
                "✅ Refund within 3-5 business days to original payment method\n" +
                "✅ Exchange available for size/color changes\n\n" +
                "📍 Go to **My Orders → Select Order → Request Return** to start!",
                Arrays.asList("📦 Track My Order", "💳 Payment Options", "❓ Help")
            );
        }

        // 5. FAQ - Shipping/Delivery
        if (containsAny(lowerMessage, "shipping", "delivery", "deliver", "ship", "kab milega", "kab aayega", "dispatch", "courier")) {
            return buildFaqResponse(
                "🚚 **Shipping & Delivery Info**\n\n" +
                "📦 Standard Delivery: 3-5 business days\n" +
                "⚡ Express Delivery: 1-2 business days\n" +
                "🆓 FREE shipping on orders above ₹499\n" +
                "📍 We deliver to 25,000+ pin codes across India\n\n" +
                "Track your existing order anytime from the **My Orders** section!",
                Arrays.asList("📦 Track My Order", "🔄 Return Policy", "🔥 Trending Products")
            );
        }

        // 6. FAQ - Payment
        if (containsAny(lowerMessage, "payment", "pay", "upi", "card", "cod", "cash on delivery", "razorpay", "paisa", "paise")) {
            return buildFaqResponse(
                "💳 **Payment Options**\n\n" +
                "✅ Credit & Debit Cards (Visa, Mastercard, RuPay)\n" +
                "✅ UPI (GPay, PhonePe, Paytm)\n" +
                "✅ Net Banking\n" +
                "✅ Razorpay Secure Payment Gateway\n" +
                "✅ Cash on Delivery (COD) available\n\n" +
                "🔒 All transactions are 100% secure & encrypted!",
                Arrays.asList("🔥 Trending Products", "🚚 Shipping Info", "❓ Help")
            );
        }

        // 7. FAQ - Contact/Support
        if (containsAny(lowerMessage, "contact", "support", "help", "complaint", "madad", "sahayata", "problem", "issue")) {
            return buildFaqResponse(
                "📞 **Customer Support**\n\n" +
                "📧 Email: support@sastaabazaar.com\n" +
                "📱 Phone: 1800-123-4567 (Toll Free)\n" +
                "⏰ Available: Mon-Sat, 9 AM - 9 PM\n" +
                "💬 You can also chat with me anytime — I'm here 24/7!\n\n" +
                "How else can I help you?",
                Arrays.asList("🔄 Return Policy", "📦 Track My Order", "🔥 Trending Products")
            );
        }

        // 8. Thanks
        if (containsAny(lowerMessage, "thank", "thanks", "shukriya", "dhanyavad", "thnx", "thx")) {
            ChatResponse res = new ChatResponse("You're welcome! 😊 Happy shopping at SastaaBazaar! Agar aur kuch chahiye toh poochiye.", "text");
            res.setQuickActions(Arrays.asList("🔥 Trending Products", "💰 Today's Deals", "❓ Help"));
            return res;
        }

        // 9. Deals / Offers / Discount
        if (containsAny(lowerMessage, "deal", "offer", "discount", "sale", "sasta", "cheap", "budget", "affordable")) {
            return handleDealsQuery();
        }

        // 10. Trending
        if (containsAny(lowerMessage, "trending", "popular", "best seller", "bestseller", "top", "famous")) {
            return handleTrendingQuery();
        }

        // 11. Bye
        if (containsAny(lowerMessage, "bye", "goodbye", "alvida", "tata", "chal", "exit", "quit")) {
            ChatResponse res = new ChatResponse("Alvida! 👋 Thank you for visiting SastaaBazaar. Come back soon for amazing deals! 🛍️", "text");
            res.setQuickActions(Arrays.asList("🔥 Trending Products", "💰 Today's Deals"));
            return res;
        }

        // 12. Fallback — try product search as last resort
        String searchKeyword = extractMainKeyword(lowerMessage);
        if (searchKeyword != null && searchKeyword.length() >= 3) {
            return handleProductSearch(lowerMessage);
        }

        // 13. Final fallback
        ChatResponse fallback = new ChatResponse(
            "🤖 Main aapka AI Shopping Assistant hoon! Main aapki madad kar sakta hoon:\n\n" +
            "🔍 **Product Search** — \"Show me phones under 10000\"\n" +
            "📦 **Order Tracking** — \"Track order 123\"\n" +
            "🚚 **Shipping Info** — \"Delivery kab hogi?\"\n" +
            "🔄 **Return Policy** — \"Return kaise karein?\"\n" +
            "💳 **Payment Help** — \"Payment options kya hain?\"\n\n" +
            "Neeche ke buttons bhi try karein! 👇",
            "text"
        );
        fallback.setQuickActions(DEFAULT_ACTIONS);
        return fallback;
    }

    // ==================== GREETING ====================
    private boolean isGreeting(String msg) {
        return containsAny(msg, "hello", "hi", "hey", "namaste", "namaskar", "good morning", "good afternoon",
                "good evening", "hola", "sup", "howdy", "kaise ho", "kya haal", "start");
    }

    private ChatResponse buildGreetingResponse() {
        String timeGreeting;
        int hour = LocalDateTime.now().getHour();
        if (hour < 12) timeGreeting = "Good Morning ☀️";
        else if (hour < 17) timeGreeting = "Good Afternoon 🌤️";
        else timeGreeting = "Good Evening 🌙";

        ChatResponse res = new ChatResponse(
            timeGreeting + " Namaste! 🙏\n\n" +
            "Welcome to **SastaaBazaar** — India ka apna smart shopping destination! 🛍️\n\n" +
            "Main aapka AI Shopping Assistant hoon. Mujhse poochiye:\n" +
            "🔍 Products search karein\n" +
            "📦 Order track karein\n" +
            "💰 Best deals paayein\n\n" +
            "Ya neeche ke buttons try karein! 👇",
            "text"
        );
        res.setQuickActions(DEFAULT_ACTIONS);
        return res;
    }

    // ==================== ORDER TRACKING ====================
    private boolean isOrderQuery(String msg) {
        return containsAny(msg, "order", "track", "tracking", "status", "mera order", "order kahan", "kab aayega");
    }

    private ChatResponse handleOrderQuery(String msg) {
        // Try to extract order ID from message
        Long orderId = extractOrderId(msg);

        if (orderId != null) {
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                ChatResponse res = new ChatResponse("", "order_status");

                ChatResponse.OrderStatusDTO dto = new ChatResponse.OrderStatusDTO();
                dto.setOrderId(order.getId());
                dto.setStatus(order.getOrderStatus() != null ? order.getOrderStatus().name() : "PENDING");
                dto.setOrderDate(order.getOrderDate() != null
                        ? order.getOrderDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")) : "N/A");
                dto.setDeliveryDate(order.getDeliverDate() != null
                        ? order.getDeliverDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")) : "N/A");
                dto.setTotalItems(order.getTotalItem());
                dto.setTotalAmount(order.getTotalSellingPrice());

                res.setResponse("📦 Here's your order status for **Order #" + orderId + "**:");
                res.setOrderStatus(dto);
                res.setQuickActions(Arrays.asList("🔍 Search Products", "🔄 Return Policy", "📞 Contact Support"));
                return res;
            } else {
                ChatResponse res = new ChatResponse(
                    "❌ Sorry, Order #" + orderId + " nahi mila. Please check your order ID.\n\n" +
                    "💡 Tip: Apna order ID **My Orders** section mein dekh sakte hain!",
                    "text"
                );
                res.setQuickActions(Arrays.asList("📦 Track My Order", "📞 Contact Support", "❓ Help"));
                return res;
            }
        }

        // No order ID found — ask for it
        ChatResponse res = new ChatResponse(
            "📦 Order track karne ke liye apna **Order ID** batayein!\n\n" +
            "Example: **\"Track order 152\"** ya **\"Order 152 ka status\"**\n\n" +
            "💡 Apna Order ID **My Orders** page par mil jayega.",
            "text"
        );
        res.setQuickActions(Arrays.asList("🔥 Trending Products", "🚚 Shipping Info", "❓ Help"));
        return res;
    }

    private Long extractOrderId(String msg) {
        Pattern pattern = Pattern.compile("(?:order|#|track)\\s*(?:#|id)?\\s*(\\d+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(msg);
        if (matcher.find()) {
            try {
                return Long.parseLong(matcher.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        // Try standalone number at end
        Pattern simpleNum = Pattern.compile("(\\d{1,10})\\s*$");
        Matcher numMatch = simpleNum.matcher(msg.trim());
        if (numMatch.find() && containsAny(msg, "order", "track", "status")) {
            try {
                return Long.parseLong(numMatch.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    // ==================== PRODUCT SEARCH ====================
    private boolean isProductSearch(String msg) {
        if (containsAny(msg, "show", "find", "search", "dikhao", "chahiye", "want", "need", "looking",
                "dikha", "batao", "recommend", "suggest", "khareedna", "kharidna", "buy", "under", "below")) {
            return true;
        }
        // Check if message contains a category keyword
        for (List<String> keywords : CATEGORY_KEYWORDS.values()) {
            for (String kw : keywords) {
                if (msg.contains(kw)) return true;
            }
        }
        return false;
    }

    private ChatResponse handleProductSearch(String msg) {
        // Extract search keyword
        String searchQuery = extractSearchQuery(msg);
        Integer maxPrice = extractMaxPrice(msg);

        List<Product> results;
        if (searchQuery != null && !searchQuery.isEmpty()) {
            results = productRepository.searchProduct(searchQuery);
        } else {
            results = productRepository.findAll();
        }

        // Filter by price if specified
        if (maxPrice != null) {
            final int max = maxPrice;
            results = results.stream()
                    .filter(p -> p.getSellingPrice() <= max)
                    .collect(Collectors.toList());
        }

        // Sort by discount (best deals first)
        results.sort((a, b) -> b.getDiscountPercent() - a.getDiscountPercent());

        // Limit to 6 products
        List<Product> topResults = results.stream().limit(6).collect(Collectors.toList());

        if (topResults.isEmpty()) {
            ChatResponse res = new ChatResponse(
                "😔 Sorry! \"" + (searchQuery != null ? searchQuery : "your search") + "\" se related koi product nahi mila.\n\n" +
                "💡 Try karein:\n" +
                "• Alag keyword use karein (e.g., \"shoes\", \"phone\", \"laptop\")\n" +
                "• Price range hatayein\n\n" +
                "Ya neeche ke options explore karein! 👇",
                "text"
            );
            res.setQuickActions(Arrays.asList("🔥 Trending Products", "💰 Today's Deals", "❓ Help"));
            return res;
        }

        // Build product DTOs
        List<ChatResponse.ProductDTO> productDTOs = topResults.stream().map(p -> {
            String image = (p.getImages() != null && !p.getImages().isEmpty()) ? p.getImages().get(0) : "";
            return new ChatResponse.ProductDTO(
                    p.getId(), p.getTitle(), image,
                    p.getSellingPrice(), p.getMrpPrice(), p.getDiscountPercent(),
                    p.getBrand()
            );
        }).collect(Collectors.toList());

        String priceText = maxPrice != null ? " under ₹" + maxPrice : "";
        ChatResponse res = new ChatResponse(
            "🔍 Found **" + results.size() + " products**" + priceText + "! Here are the top picks:\n" +
            (searchQuery != null ? "Search: \"" + searchQuery + "\"" : ""),
            "products"
        );
        res.setProducts(productDTOs);
        res.setQuickActions(Arrays.asList("💰 Show Cheaper Options", "🔥 Trending Products", "📦 Track My Order"));
        return res;
    }

    private String extractSearchQuery(String msg) {
        // First check for category keywords
        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            for (String kw : entry.getValue()) {
                if (msg.contains(kw)) {
                    return entry.getKey();
                }
            }
        }

        // Remove common filler words and extract main keywords
        String cleaned = msg.replaceAll("(?i)(show|me|find|search|for|dikhao|chahiye|want|need|looking|dikha|batao|" +
                "please|kuch|achhe|achha|acche|best|top|under|below|ke|andar|mein|mujhe|rupees|rs|price|" +
                "recommend|suggest|buy|khareedna|kharidna|good|nice|cheap|sasta|today|deals|i|the|a|an|some)", "")
                .trim();

        // Remove price numbers
        cleaned = cleaned.replaceAll("\\d+", "").trim();

        return cleaned.isEmpty() ? null : cleaned.split("\\s+")[0];
    }

    private Integer extractMaxPrice(String msg) {
        // Match patterns like "under 2000", "below 5000", "2000 ke andar", "rupees 1000", "rs 500"
        Pattern[] pricePatterns = {
                Pattern.compile("(?:under|below|within|max|upto|up to)\\s*(?:rs\\.?|₹|rupees?)?\\s*(\\d+)", Pattern.CASE_INSENSITIVE),
                Pattern.compile("(\\d+)\\s*(?:ke|k)\\s*(?:andar|under|niche|neeche)", Pattern.CASE_INSENSITIVE),
                Pattern.compile("(?:rs\\.?|₹|rupees?)\\s*(\\d+)\\s*(?:ke|k)?\\s*(?:andar|under|niche|neeche|tak)?", Pattern.CASE_INSENSITIVE),
                Pattern.compile("(\\d+)\\s*(?:rs\\.?|₹|rupees?)\\s*(?:ke|k)?\\s*(?:andar|under|mein)?", Pattern.CASE_INSENSITIVE)
        };

        for (Pattern p : pricePatterns) {
            Matcher m = p.matcher(msg);
            if (m.find()) {
                try {
                    return Integer.parseInt(m.group(1));
                } catch (NumberFormatException e) {
                    // ignore
                }
            }
        }
        return null;
    }

    // ==================== DEALS & TRENDING ====================
    private ChatResponse handleDealsQuery() {
        List<Product> allProducts = productRepository.findAll();
        List<Product> deals = allProducts.stream()
                .filter(p -> p.getDiscountPercent() >= 20)
                .sorted((a, b) -> b.getDiscountPercent() - a.getDiscountPercent())
                .limit(6)
                .collect(Collectors.toList());

        if (deals.isEmpty()) {
            ChatResponse res = new ChatResponse("Currently no special deals available. Check back soon! 🎉", "text");
            res.setQuickActions(Arrays.asList("🔥 Trending Products", "🔍 Search Products", "❓ Help"));
            return res;
        }

        List<ChatResponse.ProductDTO> productDTOs = deals.stream().map(p -> {
            String image = (p.getImages() != null && !p.getImages().isEmpty()) ? p.getImages().get(0) : "";
            return new ChatResponse.ProductDTO(p.getId(), p.getTitle(), image, p.getSellingPrice(), p.getMrpPrice(), p.getDiscountPercent(), p.getBrand());
        }).collect(Collectors.toList());

        ChatResponse res = new ChatResponse("💰 **Today's Best Deals!** Upto " + deals.get(0).getDiscountPercent() + "% OFF! 🔥", "products");
        res.setProducts(productDTOs);
        res.setQuickActions(Arrays.asList("🔍 Search Products", "📦 Track My Order", "❓ Help"));
        return res;
    }

    private ChatResponse handleTrendingQuery() {
        List<Product> allProducts = productRepository.findAll();
        List<Product> trending = allProducts.stream()
                .sorted((a, b) -> b.getNumRatings() - a.getNumRatings())
                .limit(6)
                .collect(Collectors.toList());

        if (trending.isEmpty()) {
            ChatResponse res = new ChatResponse("No trending products right now. Try searching for what you need! 🔍", "text");
            res.setQuickActions(DEFAULT_ACTIONS);
            return res;
        }

        List<ChatResponse.ProductDTO> productDTOs = trending.stream().map(p -> {
            String image = (p.getImages() != null && !p.getImages().isEmpty()) ? p.getImages().get(0) : "";
            return new ChatResponse.ProductDTO(p.getId(), p.getTitle(), image, p.getSellingPrice(), p.getMrpPrice(), p.getDiscountPercent(), p.getBrand());
        }).collect(Collectors.toList());

        ChatResponse res = new ChatResponse("🔥 **Trending Right Now** — Sabse zyada pasand kiye gaye products!", "products");
        res.setProducts(productDTOs);
        res.setQuickActions(Arrays.asList("💰 Today's Deals", "🔍 Search Products", "📦 Track My Order"));
        return res;
    }

    // ==================== FAQ BUILDER ====================
    private ChatResponse buildFaqResponse(String text, List<String> actions) {
        ChatResponse res = new ChatResponse(text, "faq");
        res.setQuickActions(actions);
        return res;
    }

    // ==================== UTILITIES ====================
    private boolean containsAny(String msg, String... keywords) {
        for (String kw : keywords) {
            if (msg.contains(kw)) return true;
        }
        return false;
    }

    private String extractMainKeyword(String msg) {
        String[] words = msg.split("\\s+");
        for (String word : words) {
            if (word.length() >= 3 && !isStopWord(word)) {
                return word;
            }
        }
        return null;
    }

    private boolean isStopWord(String word) {
        Set<String> stopWords = new HashSet<>(Arrays.asList(
                "the", "is", "at", "which", "on", "can", "you", "what", "how", "who",
                "me", "my", "do", "does", "kya", "kaise", "hai", "hain", "mein", "ka", "ki", "ke",
                "ko", "se", "par", "pe", "aur", "ya", "bhi", "toh", "nahi", "please", "plz"
        ));
        return stopWords.contains(word);
    }
}
