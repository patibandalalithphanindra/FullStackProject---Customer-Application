package com.lalith.customer.dtotests;

import com.lalith.customer.dto.OrderItem;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class OrderItemTest {

    @Test
    public void testOrderItemModel() {
        OrderItem orderItem = new OrderItem();
        orderItem.setItemId("I123");
        orderItem.setItemName("Test Item");
        orderItem.setQuantity(5);

        assertEquals("I123", orderItem.getItemId());
        assertEquals("Test Item", orderItem.getItemName());
        assertEquals(5, orderItem.getQuantity());
    }

    @Test
    public void testItemIdSetterGetter() {
        OrderItem orderItem = new OrderItem();
        orderItem.setItemId("I456");
        assertEquals("I456", orderItem.getItemId());
    }

    @Test
    public void testItemPriceSetterGetter() {
        OrderItem orderItem = new OrderItem();
        orderItem.setItemPrice(20.0);
        assertEquals(20.0, orderItem.getItemPrice());
    }

    @Test
    public void testItemNameSetterGetter() {
        OrderItem orderItem = new OrderItem();
        orderItem.setItemName("Another Item");
        assertEquals("Another Item", orderItem.getItemName());
    }

    @Test
    public void testQuantitySetterGetter() {
        OrderItem orderItem = new OrderItem();
        orderItem.setQuantity(3);
        assertEquals(3, orderItem.getQuantity());
    }

    @Test
    public void testEqualsAndHashCode() {
        OrderItem orderItem1 = new OrderItem("I123", "Test Item", 20.0, 5);
        OrderItem orderItem2 = new OrderItem("I123", "Test Item",20.0, 5);

        assertTrue(orderItem1.equals(orderItem2));
        assertTrue(orderItem2.equals(orderItem1));
        assertEquals(orderItem1.hashCode(), orderItem2.hashCode());
    }

    @Test
    public void testNotEquals() {
        OrderItem orderItem1 = new OrderItem("I123", "Test Item",20.0, 5);
        OrderItem orderItem2 = new OrderItem("I456", "Another Item",20.0, 3);

        assertFalse(orderItem1.equals(orderItem2));
        assertFalse(orderItem2.equals(orderItem1));
    }

    @Test
    public void testToString() {
        OrderItem orderItem = new OrderItem("I123", "Test Item",20.0, 5);
        String expected = "OrderItem(itemId=I123, itemName=Test Item, itemPrice=20.0, quantity=5)";
        assertEquals(expected, orderItem.toString());
    }
}
