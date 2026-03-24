package com.rohan.service.imp;

import com.rohan.model.*;
import com.rohan.Repository.OrderRepository;
import com.rohan.Repository.AddressRepository;
import com.rohan.Repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final CartItemRepository cartItemRepository;
    private final EmailService emailService;

    @Override
    public Set<Order> createOrder(User user, Address shippingAddress, Cart cart) {

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Save shipping address
        Address savedAddress = addressRepository.save(shippingAddress);

        // 🔥 Group cart items by Seller ID
        Map<Long, List<CartItem>> itemsBySeller =
                cart.getCartItems()
                        .stream()
                        .collect(Collectors.groupingBy(
                                item -> item.getProduct().getSeller().getId()
                        ));

        Set<Order> orders = new HashSet<>();

        // 🔥 Create one order per seller
        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {

            Long sellerId = entry.getKey();
            List<CartItem> items = entry.getValue();

            int totalSellingPrice = items.stream()
                    .mapToInt(item -> (item.getSellingPrice() != null ? item.getSellingPrice() : 0) * item.getQuantity())
                    .sum();

            int totalMrpPrice = items.stream()
                    .mapToInt(item -> (item.getMrpPrice() != null ? item.getMrpPrice() : 0) * item.getQuantity())
                    .sum();

            int totalItem = items.stream()
                    .mapToInt(CartItem::getQuantity)
                    .sum();

            Order createdOrder = new Order();
            createdOrder.setUser(user);
            createdOrder.setSellerId(sellerId);
            createdOrder.setShippingAddress(savedAddress);
            createdOrder.setTotalSellingPrice(totalSellingPrice);
            createdOrder.setTotalMrpPrice(totalMrpPrice);
            createdOrder.setTotalItem(totalItem);
            createdOrder.setOrderStatus(OrderStatus.PENDING);
            createdOrder.setPaymentStatus(PaymentStatus.PENDING);

            // 🔥 Create OrderItems
            List<OrderItem> orderItems = new ArrayList<>();

            for (CartItem cartItem : items) {

                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setSize(cartItem.getSize());
                orderItem.setSellingPrice(cartItem.getSellingPrice());
                orderItem.setMrpPrice(cartItem.getMrpPrice());
                orderItem.setUserId(user.getId());
                orderItem.setOrder(createdOrder);

                orderItems.add(orderItem);
            }

            createdOrder.setOrderItems(orderItems);

            createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);

            Order savedOrder = orderRepository.save(createdOrder);
            orders.add(savedOrder);
        }

        cartItemRepository.deleteAll(cart.getCartItems());

        // Send order confirmation email
        try {
            emailService.sendOrderConfirmationEmail(user, orders);
        } catch (Exception e) {
            // Don't fail the order if email fails
            System.out.println("Email sending failed: " + e.getMessage());
        }

        return orders;
    }

    @Override
    public Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> sellerOrder(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    @Override
    public Order updateOrderStatus(Long id, OrderStatus orderStatus) {
        Order order = findOrderById(id);
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Override
    public Order cancelOrder(Long orderId, User user) {

        Order order = findOrderById(orderId);

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only cancel your own orders");
        }

        if (order.getOrderStatus() == OrderStatus.DELIVERED ||
                order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order cannot be cancelled");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    private OrderItem createOrderItem(CartItem cartItem) {

        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(cartItem.getProduct());
        orderItem.setSize(cartItem.getSize());
        orderItem.setMrpPrice(cartItem.getMrpPrice());
        orderItem.setSellingPrice(cartItem.getSellingPrice());
        orderItem.setUserId(cartItem.getUserId());

        return orderItem;
    }
}