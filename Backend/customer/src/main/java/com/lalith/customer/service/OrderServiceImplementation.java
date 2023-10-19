package com.lalith.customer.service;

import com.lalith.customer.dto.OrderItem;
import com.lalith.customer.model.Customer;
import com.lalith.customer.model.Item;
import com.lalith.customer.model.Order;
import com.lalith.customer.model.Reward;
import com.lalith.customer.repository.CustomerRepository;
import com.lalith.customer.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImplementation implements OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final RewardService rewardService;
    private final ItemService itemService;

    @Autowired
    public OrderServiceImplementation(OrderRepository orderRepository, CustomerRepository customerRepository, RewardService rewardService,ItemService itemService) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.rewardService = rewardService;
        this.itemService = itemService;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<OrderItem> getOrderItemsByOrderNo(String orderNo) {
        Order order = orderRepository.findByOrderNo(orderNo);

        List<OrderItem> orderItems = order.getOrderItems();
        List<OrderItem> formattedOrderItems = new ArrayList<>();

        for (OrderItem itemData : orderItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setItemId(itemData.getItemId());
            orderItem.setItemName(itemData.getItemName());
            orderItem.setQuantity(itemData.getQuantity());
            Item item = itemService.getItem(itemData.getItemId());
            if (item != null) {
                orderItem.setItemPrice(item.getItemPrice());
            }
            formattedOrderItems.add(orderItem);
        }
        return formattedOrderItems;
    }


    @Override
    public Order createOrderWithoutRedeem(Order order, List<OrderItem> orderItems) {
        String customerId = order.getCustomerId();
        Optional<Customer> customerOptional = customerRepository.findByCustomerId(customerId);

        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            order.setCustomerPhoneNo(customer.getPhoneNo());

            String orderNo = order.getOrderNo();
            Order existingOrder = orderRepository.findByOrderNo(orderNo);
            if (existingOrder != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "An order with the same orderNo already exists.");
            }

            if (orderItems.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order must have at least one item.");
            }

            if (orderNo == null) {
                orderNo = generateOrderNo();
                order.setOrderNo(orderNo);
            }

            List<OrderItem> orderItemDtos = new ArrayList<>();
            double orderTotal = 0;

            for (OrderItem oItem : orderItems) {
                Item item = itemService.getItem(oItem.getItemId());
                double itemTotalPrice = oItem.getQuantity() * item.getItemPrice();
                orderTotal += itemTotalPrice;
                orderItemDtos.add(new OrderItem(item.getItemId(), item.getItemName(), item.getItemPrice(), oItem.getQuantity()));
            }

            Reward reward = rewardService.createReward(customerId, orderTotal, order.getOrderNo());
            order.setTotalItems(orderItemDtos.size());
            order.setOrderItems(orderItemDtos);
            order.setReward(reward);
            order.setOrderTotal(orderTotal);
            order.setOrderDate(LocalDateTime.now());
            order.setLastModifiedTS(LocalDateTime.now());

            if (order.getOrderStatus() == null) {
                order.setOrderStatus("Created");
            }
            orderRepository.save(order);
            return order;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer with customerId " + customerId + " not found.");
        }
    }

    @Override
    public Order createOrderWithRedeem(Order order, List<OrderItem> orderItems) {
        String customerId = order.getCustomerId();
        Optional<Customer> customerOptional = customerRepository.findByCustomerId(customerId);

        if (orderItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order must have at least one item.");
        }

        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            order.setCustomerPhoneNo(customer.getPhoneNo());

            String orderNo = order.getOrderNo();
            if (orderNo == null) {
                orderNo = generateOrderNo();
                order.setOrderNo(orderNo);
            }

            double rewardCoins = rewardService.getRewardBalanceOfCustomer(customerId);

            List<OrderItem> orderItemDtos = new ArrayList<>();
            double orderTotal = 0;

            for (OrderItem oItem : orderItems) {
                Item item = itemService.getItem(oItem.getItemId());
                double itemTotalPrice = oItem.getQuantity() * item.getItemPrice();
                orderTotal += itemTotalPrice;
                orderItemDtos.add(new OrderItem(item.getItemId(), item.getItemName(), item.getItemPrice(), oItem.getQuantity()));
            }

            double maxRedeemableAmount = Math.min(rewardCoins, orderTotal);

            order.setTotalItems(orderItemDtos.size());
            order.setOrderItems(orderItemDtos);
            order.setOrderTotal(orderTotal);
            order.setReward(rewardService.createRewardWithRedeem(customerId, orderTotal, orderNo, maxRedeemableAmount));

            order.setOrderDate(LocalDateTime.now());
            order.setLastModifiedTS(LocalDateTime.now());
            if (order.getOrderStatus() == null) {
                order.setOrderStatus("Created");
            }
            orderRepository.save(order);
            return order;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer with customerId " + customerId + " not found.");
        }
    }


    public String generateOrderNo() {
        UUID uuid = UUID.randomUUID();
        return "o" + uuid.toString().replace("-", "").substring(0, 9);
    }

    @Override
    public Order updateOrder(String orderNo, Order updatedOrder) {
        Optional<Order> existingOrderOptional = Optional.ofNullable(orderRepository.findByOrderNo(orderNo));
        if (existingOrderOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order with orderNo " + orderNo + " not found.");
        }

        Order existingOrder = existingOrderOptional.get();

        updatedOrder.setOrderKey(existingOrder.getOrderKey());
        updatedOrder.setOrderNo(existingOrder.getOrderNo());

        if (updatedOrder.getOrderStatus() == null) {
            updatedOrder.setOrderStatus(existingOrder.getOrderStatus());
        }

        if (updatedOrder.getOrderDate() == null) {
            updatedOrder.setOrderDate(existingOrder.getOrderDate());
        }

        if (updatedOrder.getTotalItems() == 0) {
            updatedOrder.setTotalItems(existingOrder.getTotalItems());
        }

        if (updatedOrder.getOrderTotal() == 0.0) {
            updatedOrder.setOrderTotal(existingOrder.getOrderTotal());
        }

        if (updatedOrder.getCurrency() == null) {
            updatedOrder.setCurrency(existingOrder.getCurrency());
        }

        updatedOrder.setLastModifiedTS(LocalDateTime.now());

        return orderRepository.save(updatedOrder);
    }

    @Override
    public void deleteOrder(String orderNo) {
        Optional<Order> existingOrderOptional = Optional.ofNullable(orderRepository.findByOrderNo(orderNo));
        if (existingOrderOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order with orderNo " + orderNo + " not found.");
        }

        Order existingOrder = existingOrderOptional.get();

        if ("Shipped".equalsIgnoreCase(existingOrder.getOrderStatus())) {
            LocalDateTime currentTimestamp = LocalDateTime.now();
            LocalDateTime lastModifiedTimestamp = existingOrder.getLastModifiedTS();
            long monthsDifference = currentTimestamp.getMonthValue() - lastModifiedTimestamp.getMonthValue();

            if (monthsDifference >= 3) {
                orderRepository.delete(existingOrder);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order cannot be deleted as the difference between the current date and last order modified date is less than 3 months.");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order cannot be deleted as it is not in Shipped status.");
        }
    }

    @Override
    public Order getOrderByOrderNo(String orderNo) {
        Optional<Order> order = Optional.ofNullable(orderRepository.findByOrderNo(orderNo));
        if (order.isPresent()) {
            return order.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order with orderNo " + orderNo + " not found.");
        }
    }


    @Override
    public List<Order> getOrdersByPhoneNo(String phoneNo) {
        List<Order> orders = orderRepository.findByCustomerPhoneNo(phoneNo);
        if (orders.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No orders found for phone number: " + phoneNo);
        }
        return orders;
    }

    @Override
    public List<Order> getOrdersByCustomerId(String customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        if (orders.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No orders found for customer Id: " + customerId);
        }
        return orders;
    }

    @Override
    public int getOrdersCount() {
        List<Order> orders = orderRepository.findAll();
        return orders.size();
    }

    @Override
    public Map<String, Integer> getOrderCountsByStatus() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .collect(Collectors.groupingBy(
                        Order::getOrderStatus,
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
    }
}