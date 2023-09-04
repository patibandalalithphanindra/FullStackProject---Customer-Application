package com.lalith.customer.service;

import com.lalith.customer.model.Order;
import org.springframework.stereotype.Service;

import java.util.List;

public interface OrderService {

    List<Order> getAllOrders();

    Order getOrderByOrderNo(String orderNo);

    List<Order> getOrdersByPhoneNo(String phoneNo);

    Order createOrder(Order order);

    Order updateOrder(String orderNo, Order updatedOrder);

    void deleteOrder(String orderNo);
}
