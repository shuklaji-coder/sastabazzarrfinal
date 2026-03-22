package com.rohan.service.imp;

import com.rohan.model.*;

import java.util.List;
import java.util.Set;

public interface OrderService {
    Set<Order> createOrder(User user, Address shippingAddress, Cart cart);

    Order findOrderById(Long id);

    List<Order> usersOrderHistory(Long userId);

    List<Order> sellerOrder(Long sellerId);

    Order updateOrderStatus(Long id, OrderStatus orderStatus);

    Order cancelOrder(Long orderId, User user);

    List<Order> getAllOrders();
}