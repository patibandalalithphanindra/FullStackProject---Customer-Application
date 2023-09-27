package com.lalith.customer.service;

import com.lalith.customer.model.Item;
import com.lalith.customer.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ItemServiceImplementation implements ItemService {
    private final ItemRepository itemRepository;

    @Autowired
    public ItemServiceImplementation(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public Item createItem(Item item) {
        UUID uuid = UUID.randomUUID();
        item.setItemId("i" + uuid.toString().replace("-", "").substring(0, 9));
        return itemRepository.save(item);
    }

    @Override
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @Override
    public Item getItem(String itemId) {
        return itemRepository.findByItemId(itemId);
    }

}