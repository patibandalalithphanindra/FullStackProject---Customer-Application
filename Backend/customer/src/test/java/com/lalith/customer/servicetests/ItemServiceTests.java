package com.lalith.customer.servicetests;

import com.lalith.customer.model.Item;
import com.lalith.customer.repository.ItemRepository;
import com.lalith.customer.service.ItemServiceImplementation;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


public class ItemServiceTests {
    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemServiceImplementation itemService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllItems() {
        List<Item> items = new ArrayList<>();
        items.add(new Item("item1", "Item 1", 10.0));
        items.add(new Item("item2", "Item 2", 15.0));

        when(itemRepository.findAll()).thenReturn(items);

        List<Item> result = itemService.getAllItems();

        verify(itemRepository, times(1)).findAll();

        assertEquals(items.size(), result.size());
    }

    @Test
    public void testGetItemByItemId() {
        String itemId = "item123";
        Item item = new Item(itemId, "Sample Item", 20.0);

        when(itemRepository.findByItemId(itemId)).thenReturn(item);

        Item result = itemService.getItem(itemId);

        assertEquals(itemId, result.getItemId());
    }

    @Test
    public void testCreateItem() {
        Item newItem = new Item("item456", "New Item", 25.0);

        when(itemRepository.save(newItem)).thenReturn(newItem);

        Item result = itemService.createItem(newItem);

        assertEquals(newItem.getItemId(), result.getItemId());
    }

    @Test
    public void testCreateItem_ItemAlreadyExists() {
        Item newItem = new Item("item456", "Existing Item", 25.0);
        Mockito.when(itemRepository.findByItemName(newItem.getItemName())).thenReturn(newItem);

        ResponseStatusException exception = Assertions.assertThrows(ResponseStatusException.class, () -> {
            itemService.createItem(newItem);
        });

        Assertions.assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        Assertions.assertTrue(exception.getReason().contains("An item with the same name already exists: " + newItem.getItemName()));
    }


}
