package com.lalith.customer.service;

import com.lalith.customer.dto.OrderItem;
import com.lalith.customer.model.Order;
import java.util.List;
import java.util.Map;

public interface OrderService {

    List<Order> getAllOrders();
    Order getOrderByOrderNo(String orderNo);
    int getOrdersCount();
    String generateOrderNo();
    List<Order> getOrdersByPhoneNo(String phoneNo);
    List<Order> getOrdersByCustomerId(String customerId);
    Order createOrderWithoutRedeem(Order order,List<OrderItem> orderItems);
    Order createOrderWithRedeem(Order order,List<OrderItem> orderItems);
    Order updateOrder(String orderNo, Order updatedOrder);
    void deleteOrder(String orderNo);
    List<OrderItem> getOrderItemsByOrderNo(String orderNo);
    Map<String,Integer> getOrderCountsByStatus();
}