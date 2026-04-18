package com.rohan.controller;



import com.rohan.model.*;

import com.rohan.response.ApiResponse;

import com.rohan.service.imp.OrderService;

import com.rohan.service.imp.PaymentService;

import com.rohan.service.imp.UserService;

import com.rohan.service.imp.CartService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;



import java.util.List;

import java.util.Set;



@RestController

@RequiredArgsConstructor

@RequestMapping("/api/orders")

public class OrderController {



    private final OrderService orderService;

    private final UserService userService;

    private final CartService cartService;

    private final PaymentService paymentService;





    // ------------------- CREATE ORDER -------------------



    @PostMapping

    public ResponseEntity<Set<Order>> createOrderHandler(

            @RequestBody Address shippingAddress,

            @RequestHeader("Authorization") String jwt) throws Exception {



        User user = userService.findUserByJwtToken(jwt);

        Cart cart = cartService.findUserCart(user);

        

        Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);

        

        ApiResponse res = new ApiResponse();

        res.setMessage("Order Created Successfully");



        return new ResponseEntity<>(orders, HttpStatus.CREATED);

    }



    @PostMapping("/sync-cart")
    public ResponseEntity<ApiResponse> syncCartHandler(
            @RequestBody List<Object> cartItems,
            @RequestHeader("Authorization") String jwt) throws Exception {
        
        ApiResponse res = new ApiResponse();
        res.setMessage("Cart synced successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // ------------------- GET ORDER BY ID -------------------



    @GetMapping("/{orderId}")

    public ResponseEntity<Order> getOrderByIdHandler(

            @PathVariable Long orderId,

            @RequestHeader("Authorization") String jwt) throws Exception {



        User user = userService.findUserByJwtToken(jwt);

        Order order = orderService.findOrderById(orderId);

        

        // Optional: Verify user owns this order

        if (!order.getUser().getId().equals(user.getId())) {

            throw new RuntimeException("You can only view your own orders");

        }



        return new ResponseEntity<>(order, HttpStatus.OK);

    }



    // ------------------- GET USER ORDER HISTORY -------------------



    @GetMapping("/user")

    public ResponseEntity<List<Order>> getUserOrderHistoryHandler(

            @RequestHeader("Authorization") String jwt) throws Exception {



        User user = userService.findUserByJwtToken(jwt);

        List<Order> orders = orderService.usersOrderHistory(user.getId());



        return new ResponseEntity<>(orders, HttpStatus.OK);

    }



    // ------------------- GET SELLER ORDERS -------------------



    @GetMapping("/seller")

    public ResponseEntity<List<Order>> getSellerOrdersHandler(

            @RequestHeader("Authorization") String jwt) throws Exception {



        User user = userService.findUserByJwtToken(jwt);

        

        if (user.getRole().toString().equals("ROLE_SELLER")) {

            List<Order> orders = orderService.sellerOrder(user.getId());

            return new ResponseEntity<>(orders, HttpStatus.OK);

        } else {

            throw new RuntimeException("Only sellers can access their orders");

        }

    }



    // ------------------- UPDATE ORDER STATUS -------------------



    @PutMapping("/{orderId}/status")

    public ResponseEntity<Order> updateOrderStatusHandler(

            @PathVariable Long orderId,

            @RequestBody OrderStatus orderStatus,

            @RequestHeader("Authorization") String jwt) throws Exception {



        User user = userService.findUserByJwtToken(jwt);

        Order order = orderService.findOrderById(orderId);

        

        // Only seller can update order status

        if (!order.getSellerId().equals(user.getId())) {

            throw new RuntimeException("Only seller can update order status");

        }



        Order updatedOrder = orderService.updateOrderStatus(orderId, orderStatus);



        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);

    }



    // ------------------- CANCEL ORDER -------------------



    @PutMapping("/{orderId}/cancel")

    public ResponseEntity<Order> cancelOrderHandler(

            @PathVariable Long orderId,

            @RequestHeader("Authorization") String jwt) throws Exception {



        User user = userService.findUserByJwtToken(jwt);

        Order cancelledOrder = orderService.cancelOrder(orderId, user);



        ApiResponse res = new ApiResponse();

        res.setMessage("Order Cancelled Successfully");



        return new ResponseEntity<>(cancelledOrder, HttpStatus.OK);

    }



    // ------------------- GET ALL ORDERS (ADMIN) -------------------



    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAllOrdersHandler(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        
        if (user.getRole().toString().equals("ROLE_ADMIN")) {
            List<Order> orders = orderService.getAllOrders();
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } else {
            throw new RuntimeException("Only admin can access all orders");
        }
    }

}

