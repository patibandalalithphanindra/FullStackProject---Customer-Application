package com.lalith.customer.dtotests;

import com.lalith.customer.dto.OrderItem;
import com.lalith.customer.dto.OrderSubmission;
import com.lalith.customer.model.Order;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;

public class OrderSubmissionTest {

    @Test
    public void testOrderSubmissionModel() {
        OrderSubmission orderSubmission = new OrderSubmission();
        Order order = new Order();
        order.setOrderKey("O123");
        order.setOrderNo("ORDER001");

        List<OrderItem> orderItems = new ArrayList<>();
        OrderItem item1 = new OrderItem();
        item1.setItemId("I123");
        item1.setItemName("Test Item 1");
        item1.setItemPrice(20.0);
        item1.setQuantity(2);

        orderItems.add(item1);

        orderSubmission.setOrderModalData(order);
        orderSubmission.setWithCoinsData("Yes");
        orderSubmission.setOrderItemsData(orderItems);

        assertEquals(order, orderSubmission.getOrderModalData());
        assertEquals("Yes", orderSubmission.getWithCoinsData());
        assertEquals(orderItems, orderSubmission.getOrderItemsData());
    }

    @Test
    public void testOrderModalDataSetterGetter() {
        OrderSubmission orderSubmission = new OrderSubmission();
        Order order = new Order();
        order.setOrderKey("O123");
        orderSubmission.setOrderModalData(order);
        assertEquals(order, orderSubmission.getOrderModalData());
    }

    @Test
    public void testWithCoinsDataSetterGetter() {
        OrderSubmission orderSubmission = new OrderSubmission();
        orderSubmission.setWithCoinsData("Yes");
        assertEquals("Yes", orderSubmission.getWithCoinsData());
    }

    @Test
    public void testOrderItemsDataSetterGetter() {
        OrderSubmission orderSubmission = new OrderSubmission();
        List<OrderItem> orderItems = new ArrayList<>();
        OrderItem item1 = new OrderItem();
        item1.setItemId("I123");
        item1.setItemName("Test Item 1");
        item1.setItemPrice(20.0);
        item1.setQuantity(2);

        orderItems.add(item1);

        orderSubmission.setOrderItemsData(orderItems);
        assertEquals(orderItems, orderSubmission.getOrderItemsData());
    }

    @Test
    public void testEqualsAndHashCode() {
        OrderSubmission orderSubmission1 = new OrderSubmission();
        OrderSubmission orderSubmission2 = new OrderSubmission();

        assertTrue(orderSubmission1.equals(orderSubmission2));
        assertTrue(orderSubmission2.equals(orderSubmission1));
        assertEquals(orderSubmission1.hashCode(), orderSubmission2.hashCode());
    }

    @Test
    public void testNotEquals() {
        OrderSubmission orderSubmission1 = new OrderSubmission();
        OrderSubmission orderSubmission2 = new OrderSubmission();
        orderSubmission2.setWithCoinsData("Yes");

        assertFalse(orderSubmission1.equals(orderSubmission2));
        assertFalse(orderSubmission2.equals(orderSubmission1));
    }

    @Test
    public void testToString() {
        OrderSubmission orderSubmission = new OrderSubmission();
        String expected = "OrderSubmission(orderModalData=null, withCoinsData=null, orderItemsData=null)";
        assertEquals(expected, orderSubmission.toString());
    }
}
