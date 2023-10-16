package com.lalith.customer.service;

import com.lalith.customer.model.Item;
import com.lalith.customer.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        Item existingItem = itemRepository.findByItemName(item.getItemName());
        if (existingItem != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An item with the same name already exists: " + item.getItemName());
        }

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