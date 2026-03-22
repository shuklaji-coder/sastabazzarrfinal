package com.rohan.controller;

import com.rohan.model.Order;
import com.rohan.model.OrderStatus;
import com.rohan.model.Seller;
import com.rohan.service.imp.OrderService;
import com.rohan.service.imp.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seller/orders")
public class SellerOrderController {

    private final OrderService orderService;
    private final SellerService  sellerService;

    @GetMapping()
    public ResponseEntity<List> getAllOrdersHandler(@RequestHeader("Authorization") String jwt)

        throws Exception {
        Seller  seller = sellerService.getSellerByEmail(jwt);
        List<Order> orders = orderService.sellerOrder(seller.getId());
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);

    }

    @PatchMapping("/{orderId}/status/{orderStatus}")
    public ResponseEntity<Order> updateOrderHandler(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long OrderId,
            @PathVariable OrderStatus OrderStatus
            )throws Exception {
        Order order = orderService.updateOrderStatus(OrderId, OrderStatus);
        return new ResponseEntity<>(order, HttpStatus.ACCEPTED);
    }
    }



