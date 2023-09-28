package com.lalith.customer.ModelTests;

import com.lalith.customer.model.Order;
import com.lalith.customer.dto.OrderItem;
import com.lalith.customer.model.Reward;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderTest {

    @Test
    public void testOrderModel() {
        Order order = new Order();
        order.setOrderKey("O123");
        order.setOrderNo("ORDER001");

        Reward reward = new Reward();
        reward.setRewardsKey("R123");
        reward.setRewardsId("REWARD001");
        reward.setOrderNo("ORDER123");
        reward.setCustomerId("CUST001");
        reward.setRewardsEarned(50.0);
        reward.setRewardsRedeemed(10.0);
        LocalDateTime rewardsDate = LocalDateTime.now();
        reward.setRewardsDate(rewardsDate);
        order.setReward(reward);

        List<OrderItem> orderItems = new ArrayList<>();
        OrderItem item1 = new OrderItem();
        item1.setItemId("I123");
        item1.setItemName("Test Item 1");
        item1.setQuantity(2);

        OrderItem item2 = new OrderItem();
        item2.setItemId("I124");
        item2.setItemName("Test Item 2");
        item2.setQuantity(3);

        orderItems.add(item1);
        orderItems.add(item2);
        order.setOrderItems(orderItems);

        order.setCustomerId("CUST001");
        LocalDateTime orderDate = LocalDateTime.now();
        order.setOrderDate(orderDate);

        assertEquals("O123", order.getOrderKey());
        assertEquals("ORDER001", order.getOrderNo());
        assertEquals(reward, order.getReward());
        assertEquals(orderItems, order.getOrderItems());
        assertEquals("CUST001", order.getCustomerId());
        assertEquals(orderDate, order.getOrderDate());
    }
}
