package com.lalith.customer.controllertests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lalith.customer.controller.ItemController;
import com.lalith.customer.model.Item;
import com.lalith.customer.service.ItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ItemControllerTests {

    @Mock
    private ItemService itemService;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(new ItemController(itemService)).build();
    }

    @Test
    public void testCreateItem() throws Exception {
        Item item = new Item();
        item.setItemId("123");
        item.setItemName("Sample Item");
        item.setItemPrice(10.0);

        when(itemService.createItem(eq(item))).thenReturn(item);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(item)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Item createdItem = new ObjectMapper().readValue(content, Item.class);

        assertEquals(item.getItemId(), createdItem.getItemId());
    }

    @Test
    public void testGetAllItems() throws Exception {
        List<Item> items = new ArrayList<>();
        items.add(new Item());
        items.add(new Item());

        when(itemService.getAllItems()).thenReturn(items);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/items"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<Item> returnedItems = new ObjectMapper().readValue(content, List.class);

        assertEquals(items.size(), returnedItems.size());
    }
}
