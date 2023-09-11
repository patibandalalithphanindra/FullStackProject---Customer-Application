package com.lalith.customer.service;

import com.lalith.customer.model.Customer;
import com.lalith.customer.model.Reward;
import java.util.List;

public interface RewardService {
    Reward createReward(String customerId, double totalAmount, String orderNo);
    List<Reward> getRewardsByCustomerId(String customerId);
    double getRewardBalance(String customerId);

    List<Reward> getAllRewards();
}
