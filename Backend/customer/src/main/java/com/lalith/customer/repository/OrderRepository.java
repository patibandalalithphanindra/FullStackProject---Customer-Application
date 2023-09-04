package com.lalith.customer.repository;

import com.lalith.customer.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderRepository extends MongoRepository<Order,String> {

}
