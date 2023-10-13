package com.lalith.customer.ModelTests;

import com.lalith.customer.model.Item;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ItemTest {

    @Test
    public void testItemModel() {
        Item item = new Item();
        item.setItemId("I123");
        item.setItemName("Test Item");
        item.setItemPrice(10.0);

        assertEquals("I123", item.getItemId());
        assertEquals("Test Item", item.getItemName());
        assertEquals(10.0, item.getItemPrice());
    }

    @Test
    public void testItemIdSetterGetter() {
        Item item = new Item();
        item.setItemId("I456");
        assertEquals("I456", item.getItemId());
    }

    @Test
    public void testItemNameSetterGetter() {
        Item item = new Item();
        item.setItemName("Another Item");
        assertEquals("Another Item", item.getItemName());
    }

    @Test
    public void testItemPriceSetterGetter() {
        Item item = new Item();
        item.setItemPrice(15.0);
        assertEquals(15.0, item.getItemPrice());
    }

    @Test
    public void testDefaultItemPrice() {
        Item item = new Item();
        assertEquals(0.0, item.getItemPrice());
    }

    @Test
    public void testEqualsAndHashCode() {
        Item item1 = new Item("I123", "Test Item", 10.0);
        Item item2 = new Item("I123", "Test Item", 10.0);

        assertTrue(item1.equals(item2));
        assertTrue(item2.equals(item1));
        assertEquals(item1.hashCode(), item2.hashCode());
    }

    @Test
    public void testNotEquals() {
        Item item1 = new Item("I123", "Test Item", 10.0);
        Item item2 = new Item("I456", "Another Item", 15.0);

        assertFalse(item1.equals(item2));
        assertFalse(item2.equals(item1));
    }

    @Test
    public void testToString() {
        Item item = new Item("I123", "Test Item", 10.0);
        String expected = "Item(itemId=I123, itemName=Test Item, itemPrice=10.0)";
        assertEquals(expected, item.toString());
    }
}
