package com.lalith.customer.service;

import com.lalith.customer.model.Item;

import java.util.List;

public interface ItemService {
    Item createItem(Item item);
    List<Item> getAllItems();
    Item getItem(String itemId);

}