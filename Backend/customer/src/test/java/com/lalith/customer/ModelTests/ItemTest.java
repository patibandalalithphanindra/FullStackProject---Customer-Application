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
}
