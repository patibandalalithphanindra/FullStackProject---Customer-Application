package com.lalith.customer.servicetests;

import com.lalith.customer.dto.OrderItem;
import com.lalith.customer.model.Customer;
import com.lalith.customer.model.Item;
import com.lalith.customer.model.Order;
import com.lalith.customer.model.Reward;
import com.lalith.customer.repository.CustomerRepository;
import com.lalith.customer.repository.OrderRepository;
import com.lalith.customer.service.ItemService;
import com.lalith.customer.service.OrderServiceImplementation;
import com.lalith.customer.service.RewardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OrderServiceTests {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private RewardService rewardService;

    @Mock
    private ItemService itemService;

    @InjectMocks
    private OrderServiceImplementation orderService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllOrders() {
        List<Order> orders = new ArrayList<>();
        orders.add(createSampleOrder("ORDER123"));
        orders.add(createSampleOrder("ORDER456"));

        when(orderRepository.findAll()).thenReturn(orders);

        List<Order> result = orderService.getAllOrders();

        verify(orderRepository, times(1)).findAll();

        assertEquals(orders.size(), result.size());
        assertEquals("ORDER123", result.get(0).getOrderNo());
        assertEquals("ORDER456", result.get(1).getOrderNo());
    }

    @Test
    public void testCreateOrderWithoutRedeem() {
        when(customerRepository.findByCustomerId("CUSTOMER123")).thenReturn(Optional.of(createSampleCustomer("CUSTOMER123")));
        when(orderRepository.findByOrderNo(anyString())).thenReturn(null);
        when(itemService.getItem(anyString())).thenReturn(createSampleItem());
        when(rewardService.createReward(anyString(), anyDouble(), anyString())).thenReturn(createSampleReward());

        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(createSampleOrderItem("ITEM123"));
        Order order = createSampleOrder("ORDER123", orderItems);


        Order createdOrder = orderService.createOrderWithoutRedeem(order, orderItems);
        System.out.println(createdOrder + "createdorder");

        assertNotNull(createdOrder);
        assertNotNull(createdOrder.getOrderNo());
        assertEquals("CUSTOMER123", createdOrder.getCustomerId());
        assertEquals(1, createdOrder.getTotalItems());
        assertEquals(10.0, createdOrder.getOrderTotal());
        assertNotNull(createdOrder.getReward());
        assertNotNull(createdOrder.getOrderDate());

        verify(customerRepository, times(1)).findByCustomerId("CUSTOMER123");
        verify(orderRepository, times(1)).findByOrderNo(null);
        verify(itemService, times(1)).getItem("ITEM123");
        verify(rewardService, times(1)).createReward("CUSTOMER123", 10.0, createdOrder.getOrderNo());
    }

    @Test
    public void testCreateOrderWithRedeem() {
        when(customerRepository.findByCustomerId("CUSTOMER123")).thenReturn(Optional.of(createSampleCustomer("CUSTOMER123")));
        when(orderRepository.findByOrderNo(anyString())).thenReturn(null);
        when(itemService.getItem(anyString())).thenReturn(createSampleItem());
        when(rewardService.getRewardBalanceOfCustomer("CUSTOMER123")).thenReturn((int) 1000.0);
        when(rewardService.createRewardWithRedeem(anyString(), anyDouble(), anyString(), anyDouble())).thenReturn(createSampleReward());

        Order order = createSampleOrder("0RDER123");
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(createSampleOrderItem("ITEM123"));

        Order createdOrder = orderService.createOrderWithRedeem(order, orderItems);
        System.out.println(createdOrder);

        assertNotNull(createdOrder);
        assertNotNull(createdOrder.getOrderNo());
        assertEquals("CUSTOMER123", createdOrder.getCustomerId());
        assertEquals(1, createdOrder.getTotalItems());
        assertEquals(0.0, createdOrder.getOrderTotal());
        assertNotNull(createdOrder.getReward());
        assertNotNull(createdOrder.getOrderDate());

        verify(customerRepository, times(1)).findByCustomerId("CUSTOMER123");
        verify(orderRepository, times(1)).findByOrderNo(null);
        verify(itemService, times(1)).getItem("ITEM123");
        verify(rewardService, times(1)).getRewardBalanceOfCustomer("CUSTOMER123");
        verify(rewardService, times(1)).createRewardWithRedeem("CUSTOMER123", 0.0, createdOrder.getOrderNo(), 10.0);
    }

    @Test
    public void testGenerateOrderNo() {
        String orderNo = orderService.generateOrderNo();

        assertNotNull(orderNo);
        assertTrue(orderNo.startsWith("o"));
        assertEquals(10, orderNo.length());
    }

    @Test
    public void testUpdateOrder() {
        String orderNo = "ORDER123";
        Order existingOrder = createSampleOrder(orderNo);
        Order updatedOrder = createSampleOrder(orderNo);

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(existingOrder);
        when(orderRepository.save(updatedOrder)).thenReturn(updatedOrder);

        Order result = orderService.updateOrder(orderNo, updatedOrder);

        assertNotNull(result);
        assertEquals(orderNo, result.getOrderNo());
        assertEquals(existingOrder.getOrderKey(), result.getOrderKey());
        assertEquals(updatedOrder.getOrderStatus(), result.getOrderStatus());
        assertEquals(updatedOrder.getOrderDate(), result.getOrderDate());
        assertEquals(updatedOrder.getTotalItems(), result.getTotalItems());
        assertEquals(updatedOrder.getOrderTotal(), result.getOrderTotal());
        assertEquals(updatedOrder.getCurrency(), result.getCurrency());

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
        verify(orderRepository, times(1)).save(updatedOrder);
    }

    @Test
    public void testDeleteOrder() {
        String orderNo = "ORDER123";
        Order existingOrder = createSampleOrder(orderNo);
        existingOrder.setOrderStatus("Shipped");
        existingOrder.setLastModifiedTS(LocalDateTime.now().minusMonths(2));

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(existingOrder);

        assertThrows(ResponseStatusException.class, () -> orderService.deleteOrder(orderNo));

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
        verify(orderRepository, never()).delete(existingOrder);
    }

    @Test
    public void testGetOrderByOrderNo() {
        String orderNo = "ORDER123";
        Order existingOrder = createSampleOrder(orderNo);

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(existingOrder);

        Order result = orderService.getOrderByOrderNo(orderNo);

        assertNotNull(result);
        assertEquals(orderNo, result.getOrderNo());

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
    }

    @Test
    public void testGetOrdersByPhoneNo() {
        String phoneNo = "1234567890";
        List<Order> orders = new ArrayList<>();
        orders.add(createSampleOrder("ORDER123"));
        orders.add(createSampleOrder("ORDER456"));

        when(orderRepository.findByCustomerPhoneNo(phoneNo)).thenReturn(orders);

        List<Order> result = orderService.getOrdersByPhoneNo(phoneNo);

        verify(orderRepository, times(1)).findByCustomerPhoneNo(phoneNo);

        assertEquals(orders.size(), result.size());
        assertEquals("ORDER123", result.get(0).getOrderNo());
        assertEquals("ORDER456", result.get(1).getOrderNo());
    }

    @Test
    public void testGetOrdersByCustomerId() {
        String customerId = "CUSTOMER123";
        List<Order> orders = new ArrayList<>();
        orders.add(createSampleOrder("ORDER123"));
        orders.add(createSampleOrder("ORDER456"));

        when(orderRepository.findByCustomerId(customerId)).thenReturn(orders);

        List<Order> result = orderService.getOrdersByCustomerId(customerId);

        verify(orderRepository, times(1)).findByCustomerId(customerId);

        assertEquals(orders.size(), result.size());
        assertEquals("ORDER123", result.get(0).getOrderNo());
        assertEquals("ORDER456", result.get(1).getOrderNo());
    }

    private Order createSampleOrder(String orderNo, List<OrderItem> orderItems) {
        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setCustomerId("CUSTOMER123");
        order.setTotalItems(1);
        order.setOrderTotal(10.0);
        order.setOrderItems(orderItems);
        order.setReward(createSampleReward());
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("Created");
        order.setCustomerPhoneNo("9876512340");
        order.setCurrency("INR");
        System.out.println(order + "order");
        return order;
    }

    private Order createSampleOrder(String orderNo) {
        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setCustomerId("CUSTOMER123");
        order.setTotalItems(1);
        order.setOrderTotal(10.0);
        order.setReward(createSampleReward());
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("Created");
        order.setCustomerPhoneNo("9876512340");
        order.setCurrency("INR");
        System.out.println(order + "order");
        return order;
    }

    private Customer createSampleCustomer(String customerId) {
        Customer customer = new Customer();
        customer.setCustomerId(customerId);
        customer.setPhoneNo("1234567890");
        System.out.println(customer+"customer");
        return customer;
    }

    private Item createSampleItem() {
        Item item = new Item();
        item.setItemId("ITEM123");
        item.setItemName("Item 123");
        item.setItemPrice(10.0);
        System.out.println(item + "item");
        return item;
    }

    private OrderItem createSampleOrderItem(String itemId) {
        OrderItem orderItem = new OrderItem();
        orderItem.setItemId(itemId);
        orderItem.setItemName("Item 123");
        orderItem.setQuantity(1);
        System.out.println(orderItem);
        return orderItem;
    }

    private Reward createSampleReward() {
        Reward reward = new Reward();
        reward.setRewardsId("REWARD123");
        reward.setOrderNo("ORDER123");
        reward.setCustomerId("CUSTOMER123");
        reward.setRewardsEarned(10.0);
        reward.setRewardsRedeemed(0.0);
        reward.setRewardsDate(LocalDateTime.now());
//        System.out.println(reward + "");
        return reward;
    }
}
