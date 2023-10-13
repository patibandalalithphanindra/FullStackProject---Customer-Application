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
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
        Customer sampleCustomer = createSampleCustomer("CUSTOMER123");
        Item sampleItem = createSampleItem();
        OrderItem sampleOrderItem = createSampleOrderItem("ITEM123");
        when(rewardService.createReward(anyString(), anyDouble(), anyString())).thenReturn(createSampleReward(1000.0));


        Order order = createSampleOrder(null, List.of(sampleOrderItem));

        when(customerRepository.findByCustomerId("CUSTOMER123")).thenReturn(Optional.of(sampleCustomer));
        when(orderRepository.findByOrderNo(null)).thenReturn(null);
        when(itemService.getItem("ITEM123")).thenReturn(sampleItem);
        when(rewardService.createReward("CUSTOMER123", 1000.0, order.getOrderNo())).thenReturn(createSampleReward(1000.0));

        Order createdOrder = orderService.createOrderWithoutRedeem(order, List.of(sampleOrderItem));

        assertNotNull(createdOrder);
        assertNotNull(createdOrder.getOrderNo());
        assertEquals("CUSTOMER123", createdOrder.getCustomerId());
        assertEquals(1, createdOrder.getTotalItems());
        assertEquals(1000.0, createdOrder.getOrderTotal());
        assertNotNull(createdOrder.getReward());
        assertNotNull(createdOrder.getOrderDate());
        verify(customerRepository, times(1)).findByCustomerId("CUSTOMER123");
        verify(orderRepository, times(1)).findByOrderNo(null);
        verify(itemService, times(1)).getItem("ITEM123");

    }
    @Test
    public void testCreateOrderWithRedeem() {
        Customer sampleCustomer = createSampleCustomer("CUSTOMER123");
        Item sampleItem = createSampleItem();
        OrderItem sampleOrderItem = createSampleOrderItem("ITEM123");
        when(rewardService.createRewardWithRedeem(anyString(), anyDouble(), anyString(), anyDouble())).thenReturn(createSampleReward(1000.0, 1000.0));

        when(customerRepository.findByCustomerId("CUSTOMER123")).thenReturn(Optional.of(sampleCustomer));
        when(orderRepository.findByOrderNo("0RDER123")).thenReturn(createSampleOrder("ORDER123"));
        when(itemService.getItem("ITEM123")).thenReturn(sampleItem);
        when(rewardService.createRewardWithRedeem("CUSTOMER123", 1000.0, "0RDER123", 1000.0))
                .thenReturn(createSampleReward(1000.0, 1000.0));

        Order order = createSampleOrder("ORDER123", List.of(sampleOrderItem));

        Order createdOrder = orderService.createOrderWithRedeem(order, List.of(sampleOrderItem));

        assertNotNull(createdOrder);
        assertNotNull(createdOrder.getOrderNo());
        assertEquals("CUSTOMER123", createdOrder.getCustomerId());
        assertEquals(1, createdOrder.getTotalItems());
        assertEquals(0.0, createdOrder.getOrderTotal() - createdOrder.getReward().getRewardsRedeemed());
        assertNotNull(createdOrder.getReward());
        assertNotNull(createdOrder.getOrderDate());

        verify(customerRepository, times(1)).findByCustomerId("CUSTOMER123");
        verify(itemService, times(1)).getItem("ITEM123");
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
        order.setOrderTotal(1000.0);
        order.setOrderItems(orderItems);
        order.setReward(createSampleReward(1000.0));
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("Created");
        order.setCustomerPhoneNo("9876512340");
        order.setCurrency("INR");
        return order;
    }

    private Order createSampleOrder(String orderNo) {
        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setCustomerId("CUSTOMER123");
        order.setTotalItems(1);
        order.setOrderTotal(1000.0);
        order.setReward(createSampleReward(1000.0));
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("Created");
        order.setCustomerPhoneNo("9876512340");
        order.setCurrency("INR");
        return order;
    }

    private Customer createSampleCustomer(String customerId) {
        Customer customer = new Customer();
        customer.setCustomerId(customerId);
        customer.setPhoneNo("1234567890");
        return customer;
    }

    private Item createSampleItem() {
        Item item = new Item();
        item.setItemId("ITEM123");
        item.setItemName("Item 123");
        item.setItemPrice(1000.0);
        return item;
    }

    private OrderItem createSampleOrderItem(String itemId) {
        OrderItem orderItem = new OrderItem();
        orderItem.setItemId(itemId);
        orderItem.setItemName("Item 123");
        orderItem.setQuantity(1);
        return orderItem;
    }

    private Reward createSampleReward(double orderAmount) {
        Reward reward = new Reward();
        reward.setRewardsId("REWARD123");
        reward.setOrderNo("ORDER123");
        reward.setCustomerId("CUSTOMER123");
        double rewardAmount = orderAmount * 0.05;
        reward.setRewardsEarned(rewardAmount);
        reward.setRewardsRedeemed(0.0);
        reward.setRewardsDate(LocalDateTime.now());
        return reward;
    }

    private Reward createSampleReward(double orderAmount, double redeemed) {
        Reward reward = new Reward();
        reward.setRewardsId("REWARD123");
        reward.setOrderNo("ORDER123");
        reward.setCustomerId("CUSTOMER123");
        double rewardAmount = orderAmount * 0.05;
        reward.setRewardsEarned(rewardAmount);
        reward.setRewardsRedeemed(1000.0);
        reward.setRewardsDate(LocalDateTime.now());
        return reward;
    }
    @Test
    public void testCreateOrderWithoutRedeem_CustomerNotFound() {
        when(customerRepository.findByCustomerId("NON_EXISTENT_CUSTOMER")).thenReturn(Optional.empty());

        List<OrderItem> orderItems = new ArrayList<>();
        Order order = createSampleOrder("ORDER123", orderItems);
        order.setCustomerId("NON_EXISTENT_CUSTOMER");

        assertThrows(ResponseStatusException.class, () -> {
            orderService.createOrderWithoutRedeem(order, orderItems);
        });

        verify(customerRepository, times(1)).findByCustomerId("NON_EXISTENT_CUSTOMER");
    }

    @Test
    public void testCreateOrderWithRedeem_CustomerNotFound() {
        when(customerRepository.findByCustomerId("NON_EXISTENT_CUSTOMER")).thenReturn(Optional.empty());

        List<OrderItem> orderItems = new ArrayList<>();
        Order order = createSampleOrder("ORDER123", orderItems);
        order.setCustomerId("NON_EXISTENT_CUSTOMER");

        assertThrows(ResponseStatusException.class, () -> {
            orderService.createOrderWithRedeem(order, orderItems);
        });

        verify(customerRepository, times(1)).findByCustomerId("NON_EXISTENT_CUSTOMER");
    }

    @Test
    public void testUpdateOrder_OrderNotFound() {
        String orderNo = "NON_EXISTENT_ORDER";
        Order updatedOrder = createSampleOrder(orderNo);

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(null);

        assertThrows(ResponseStatusException.class, () -> {
            orderService.updateOrder(orderNo, updatedOrder);
        });

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
    }

    @Test
    public void testDeleteOrder_OrderNotFound() {
        String orderNo = "NON_EXISTENT_ORDER";

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(null);

        assertThrows(ResponseStatusException.class, () -> {
            orderService.deleteOrder(orderNo);
        });

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
    }

    @Test
    public void testGetOrderByOrderNo_OrderNotFound() {
        String orderNo = "NON_EXISTENT_ORDER";

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(null);

        assertThrows(ResponseStatusException.class, () -> {
            orderService.getOrderByOrderNo(orderNo);
        });

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
    }

    @Test
    public void testGetOrdersByPhoneNo_NoOrdersFound() {
        String phoneNo = "NON_EXISTENT_PHONE";
        when(orderRepository.findByCustomerPhoneNo(phoneNo)).thenReturn(new ArrayList<>());

        assertThrows(ResponseStatusException.class, () -> {
            orderService.getOrdersByPhoneNo(phoneNo);
        });

        verify(orderRepository, times(1)).findByCustomerPhoneNo(phoneNo);
    }

    @Test
    public void testGetOrdersByCustomerId_NoOrdersFound() {
        String customerId = "NON_EXISTENT_CUSTOMER";
        when(orderRepository.findByCustomerId(customerId)).thenReturn(new ArrayList<>());

        assertThrows(ResponseStatusException.class, () -> {
            orderService.getOrdersByCustomerId(customerId);
        });

        verify(orderRepository, times(1)).findByCustomerId(customerId);
    }

    @Test
    public void testCreateOrderWithoutRedeem_DuplicateOrderNo() {
        when(customerRepository.findByCustomerId("CUSTOMER123")).thenReturn(Optional.of(createSampleCustomer("CUSTOMER123")));
        when(orderRepository.findByOrderNo("DUPLICATE_ORDER")).thenReturn(createSampleOrder("DUPLICATE_ORDER"));

        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(createSampleOrderItem("ITEM123"));
        Order order = createSampleOrder("DUPLICATE_ORDER", orderItems);

        assertThrows(ResponseStatusException.class, () -> {
            orderService.createOrderWithoutRedeem(order, orderItems);
        });

        verify(customerRepository, times(1)).findByCustomerId("CUSTOMER123");
        verify(orderRepository, times(1)).findByOrderNo("DUPLICATE_ORDER");
    }

    @Test
    public void testCreateOrderWithRedeem_InsufficientRewards() {
        when(customerRepository.findByCustomerId("CUSTOMER123")).thenReturn(Optional.of(createSampleCustomer("CUSTOMER123")));
        when(orderRepository.findByOrderNo(null)).thenReturn(null);
        when(itemService.getItem("ITEM123")).thenReturn(createSampleItem());
        when(rewardService.getRewardBalanceOfCustomer("CUSTOMER123")).thenReturn((int) 500.0);

        Order order = createSampleOrder("ORDER123");
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(createSampleOrderItem("ITEM123"));

        Order createdOrder = orderService.createOrderWithRedeem(order, orderItems);

        assertNotNull(createdOrder);
        assertEquals("Created", createdOrder.getOrderStatus());

        verify(customerRepository, times(1)).findByCustomerId("CUSTOMER123");
        verify(itemService, times(1)).getItem("ITEM123");
        verify(rewardService, times(1)).getRewardBalanceOfCustomer("CUSTOMER123");
    }

    @Test
    public void testDeleteOrder_OrderNotShipped() {
        String orderNo = "ORDER123";
        Order existingOrder = createSampleOrder(orderNo);
        existingOrder.setOrderStatus("Created");

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(existingOrder);

        assertThrows(ResponseStatusException.class, () -> {
            orderService.deleteOrder(orderNo);
        });

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
        verify(orderRepository, never()).delete(existingOrder);
    }

    @Test
    public void testDeleteOrder_LastModifiedWithin3Months() {
        String orderNo = "ORDER123";
        Order existingOrder = createSampleOrder(orderNo);
        existingOrder.setOrderStatus("Shipped");
        existingOrder.setLastModifiedTS(LocalDateTime.now().minusMonths(2));

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(existingOrder);

        assertThrows(ResponseStatusException.class, () -> {
            orderService.deleteOrder(orderNo);
        });

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
        verify(orderRepository, never()).delete(existingOrder);
    }

    @Test
    public void testDeleteOrder_OrderShipped_And_LastModified3MonthsAgo() {
        String orderNo = "ORDER123";
        Order existingOrder = createSampleOrder(orderNo);
        existingOrder.setOrderStatus("Shipped");
        existingOrder.setLastModifiedTS(LocalDateTime.now().minusMonths(3));

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(existingOrder);
        doNothing().when(orderRepository).delete(existingOrder);

        orderService.deleteOrder(orderNo);

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
        verify(orderRepository, times(1)).delete(existingOrder);
    }

    @Test
    public void testDeleteOrder_OrderShipped_But_LastModifiedWithin3Months() {
        String orderNo = "ORDER123";
        Order existingOrder = createSampleOrder(orderNo);
        existingOrder.setOrderStatus("Shipped");
        existingOrder.setLastModifiedTS(LocalDateTime.now().minusMonths(2));

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(existingOrder);

        assertThrows(ResponseStatusException.class, () -> {
            orderService.deleteOrder(orderNo);
        });

        verify(orderRepository, times(1)).findByOrderNo(orderNo);
        verify(orderRepository, never()).delete(existingOrder);
    }

    @Test
    public void testCreateOrderWithoutRedeem_NullOrderNo() {
        Order order = new Order();
        order.setCustomerId("customer123");
        order.setOrderNo(null);

        List<OrderItem> orderItems = new ArrayList<>();

        when(customerRepository.findByCustomerId("customer123"))
                .thenReturn(Optional.of(new Customer()));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> orderService.createOrderWithoutRedeem(order, orderItems));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    public void testCreateOrderWithoutRedeem_EmptyOrderItems() {
        when(customerRepository.findByCustomerId("CUSTOMER123")).thenReturn(Optional.of(createSampleCustomer("CUSTOMER123")));
        when(orderRepository.findByOrderNo(anyString())).thenReturn(null);

        List<OrderItem> orderItems = new ArrayList<>();
        Order order = createSampleOrder(null, orderItems);

        assertThrows(ResponseStatusException.class, () -> {
            orderService.createOrderWithoutRedeem(order, orderItems);
        });

        verify(customerRepository, times(1)).findByCustomerId("CUSTOMER123");
        verify(orderRepository, times(1)).findByOrderNo(null);
    }


    @Test
    public void testGetOrderCountsByStatus() {
        List<Order> mockOrders = new ArrayList<>();
        Order order1 = new Order();
        order1.setOrderNo("Order1");
        order1.setOrderStatus("Created");

        Order order2 = new Order();
        order2.setOrderNo("Order2");
        order2.setOrderStatus("Shipped");

        Order order3 = new Order();
        order3.setOrderNo("Order3");
        order3.setOrderStatus("Created");

        mockOrders.add(order1);
        mockOrders.add(order2);
        mockOrders.add(order3);

        when(orderRepository.findAll()).thenReturn(mockOrders);

        Map<String, Integer> statusCounts = orderService.getOrderCountsByStatus();

        assertEquals(2, statusCounts.get("Created").intValue());
        assertEquals(1, statusCounts.get("Shipped").intValue());
    }

    @Test
    public void testGetOrdersCount() {
        List<Order> orders = new ArrayList<>();
        orders.add(createSampleOrder("ORDER123"));
        orders.add(createSampleOrder("ORDER456"));

        when(orderRepository.findAll()).thenReturn(orders);

        int ordersCount = orderService.getOrdersCount();

        assertEquals(orders.size(), ordersCount);
    }

    @Test
    public void testGetOrderItemsByOrderNo() {
        String orderNo = "ORDER123";
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(createSampleOrderItem("ITEM123"));

        Order order = createSampleOrder(orderNo, orderItems);

        when(orderRepository.findByOrderNo(orderNo)).thenReturn(order);

        List<OrderItem> result = orderService.getOrderItemsByOrderNo(orderNo);

        verify(orderRepository, times(1)).findByOrderNo(orderNo);

        assertEquals(orderItems.size(), result.size());
        assertEquals("ITEM123", result.get(0).getItemId());
    }


}
