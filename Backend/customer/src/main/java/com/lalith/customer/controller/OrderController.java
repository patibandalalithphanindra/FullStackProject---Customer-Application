package com.lalith.customer.controller;

import com.lalith.customer.model.Order;
import com.lalith.customer.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
   private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            Order createdOrder = orderService.createOrder(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/byOrder/{orderNo}")
    public ResponseEntity<Order> getOrderByOrderNo(@PathVariable String orderNo) {
        try {
            Order order = orderService.getOrderByOrderNo(orderNo);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/byPhone/{phoneNo}")
    public ResponseEntity<List<Order>> getOrdersByPhoneNo(@PathVariable String phoneNo) {
        List<Order> orders = orderService.getOrdersByPhoneNo(phoneNo);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderNo}")
    public ResponseEntity<Order> updateOrder(
            @PathVariable String orderNo,
            @RequestBody Order updatedOrder) {
        try {
            Order updated = orderService.updateOrder(orderNo, updatedOrder);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{orderNo}")
    public ResponseEntity<String> deleteOrder(@PathVariable String orderNo) {
        try {
            orderService.deleteOrder(orderNo);
            return ResponseEntity.ok("Order deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
    }
}
