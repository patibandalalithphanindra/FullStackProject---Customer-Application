package com.lalith.customer.repository;

import com.lalith.customer.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order,String> {

    Order findByOrderNo(String orderNo);

    List<Order> findByCustomerPhoneNo(String phoneNo);

    void deleteByOrderNo(String orderNo);
}
