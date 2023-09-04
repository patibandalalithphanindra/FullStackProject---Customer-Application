package com.lalith.customer.repository;

import com.lalith.customer.model.Reward;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RewardRepository extends MongoRepository<Reward,String> {

}
