package com.lalith.customer.service;

import com.lalith.customer.model.Order;
import com.lalith.customer.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImplementation implements OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderServiceImplementation(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order createOrder(Order order) {
        Optional<Order> existingOrder = Optional.ofNullable(orderRepository.findByOrderNo(order.getOrderNo()));
        if (existingOrder.isPresent()) {
            throw new RuntimeException("An order with the same orderNo already exists.");
        }

        order.setOrderDate(LocalDateTime.now());
        order.setLastModifiedTS(LocalDateTime.now());

        if (order.getOrderStatus() == null) {
            order.setOrderStatus("Created");
        }

        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(String orderNo, Order updatedOrder) {
        Optional<Order> existingOrderOptional = Optional.ofNullable(orderRepository.findByOrderNo(orderNo));
        if (!existingOrderOptional.isPresent()) {
            throw new RuntimeException("Order with orderNo " + orderNo + " not found.");
        }

        Order existingOrder = existingOrderOptional.get();

        updatedOrder.setOrderKey(existingOrder.getOrderKey());
        updatedOrder.setOrderNo(existingOrder.getOrderNo());

        if ("Shipped".equalsIgnoreCase(updatedOrder.getOrderStatus())) {
            updatedOrder.setOrderStatus("Shipped");
        }

        updatedOrder.setLastModifiedTS(LocalDateTime.now());

        return orderRepository.save(updatedOrder);
    }

    @Override
    public void deleteOrder(String orderNo) {
        Optional<Order> existingOrderOptional = Optional.ofNullable(orderRepository.findByOrderNo(orderNo));
        if (!existingOrderOptional.isPresent()) {
            throw new RuntimeException("Order with orderNo " + orderNo + " not found.");
        }

        Order existingOrder = existingOrderOptional.get();

        if ("Shipped".equalsIgnoreCase(existingOrder.getOrderStatus())) {
            LocalDateTime currentTimestamp = LocalDateTime.now();
            LocalDateTime lastModifiedTimestamp = existingOrder.getLastModifiedTS();
            long monthsDifference = currentTimestamp.getMonthValue() - lastModifiedTimestamp.getMonthValue();

            if (monthsDifference >= 3) {
                orderRepository.delete(existingOrder);
            } else {
                throw new RuntimeException("Order cannot be deleted as it is not in Shipped status or the difference between the current date and last order modified date is less than 3 months.");
            }
        } else {
            throw new RuntimeException("Order cannot be deleted as it is not in Shipped status.");
        }
    }

    @Override
    public Order getOrderByOrderNo(String orderNo) {
        Optional<Order> order = Optional.ofNullable(orderRepository.findByOrderNo(orderNo));
        if (order.isPresent()) {
            return order.get();
        } else {
            throw new RuntimeException("Order with orderNo " + orderNo + " not found.");
        }
    }

    @Override
    public List<Order> getOrdersByPhoneNo(String phoneNo) {
        return orderRepository.findByCustomerPhoneNo(phoneNo);
    }
}
