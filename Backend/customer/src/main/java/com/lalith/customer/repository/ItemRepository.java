package com.lalith.customer.repository;

import com.lalith.customer.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    Item findByItemId(String itemId);
    List<Item> findAll();
}