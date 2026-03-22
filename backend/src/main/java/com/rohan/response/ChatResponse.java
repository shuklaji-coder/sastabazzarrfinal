package com.rohan.response;

import java.util.List;

public class ChatResponse {
    private String response;
    private String type; // "text", "products", "order_status", "faq"
    private List<ProductDTO> products;
    private List<String> quickActions;
    private OrderStatusDTO orderStatus;

    public ChatResponse() {}

    public ChatResponse(String response) {
        this.response = response;
        this.type = "text";
    }

    public ChatResponse(String response, String type) {
        this.response = response;
        this.type = type;
    }

    // Getters & Setters
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<ProductDTO> getProducts() { return products; }
    public void setProducts(List<ProductDTO> products) { this.products = products; }

    public List<String> getQuickActions() { return quickActions; }
    public void setQuickActions(List<String> quickActions) { this.quickActions = quickActions; }

    public OrderStatusDTO getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatusDTO orderStatus) { this.orderStatus = orderStatus; }

    // Inner DTO for product cards in chat
    public static class ProductDTO {
        private Long id;
        private String title;
        private String image;
        private int sellingPrice;
        private int mrpPrice;
        private int discountPercent;
        private String brand;

        public ProductDTO() {}

        public ProductDTO(Long id, String title, String image, int sellingPrice, int mrpPrice, int discountPercent, String brand) {
            this.id = id;
            this.title = title;
            this.image = image;
            this.sellingPrice = sellingPrice;
            this.mrpPrice = mrpPrice;
            this.discountPercent = discountPercent;
            this.brand = brand;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
        public int getSellingPrice() { return sellingPrice; }
        public void setSellingPrice(int sellingPrice) { this.sellingPrice = sellingPrice; }
        public int getMrpPrice() { return mrpPrice; }
        public void setMrpPrice(int mrpPrice) { this.mrpPrice = mrpPrice; }
        public int getDiscountPercent() { return discountPercent; }
        public void setDiscountPercent(int discountPercent) { this.discountPercent = discountPercent; }
        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }
    }

    // Inner DTO for order status in chat
    public static class OrderStatusDTO {
        private Long orderId;
        private String status;
        private String orderDate;
        private String deliveryDate;
        private int totalItems;
        private Integer totalAmount;

        public OrderStatusDTO() {}

        public Long getOrderId() { return orderId; }
        public void setOrderId(Long orderId) { this.orderId = orderId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getOrderDate() { return orderDate; }
        public void setOrderDate(String orderDate) { this.orderDate = orderDate; }
        public String getDeliveryDate() { return deliveryDate; }
        public void setDeliveryDate(String deliveryDate) { this.deliveryDate = deliveryDate; }
        public int getTotalItems() { return totalItems; }
        public void setTotalItems(int totalItems) { this.totalItems = totalItems; }
        public Integer getTotalAmount() { return totalAmount; }
        public void setTotalAmount(Integer totalAmount) { this.totalAmount = totalAmount; }
    }
}
