package com.lalith.customer.repository;

import com.lalith.customer.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    Item findByItemId(String itemId);
    Item findByItemName(String itemName);
}