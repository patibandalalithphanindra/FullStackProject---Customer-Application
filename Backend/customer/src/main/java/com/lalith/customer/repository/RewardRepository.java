package com.lalith.customer.repository;

import com.lalith.customer.model.Reward;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RewardRepository extends MongoRepository<Reward,String> {
    List<Reward> findByCustomerId(String customerId);
}
