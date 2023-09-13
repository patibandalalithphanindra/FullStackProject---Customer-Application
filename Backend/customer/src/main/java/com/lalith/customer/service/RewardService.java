package com.lalith.customer.service;

import com.lalith.customer.model.Reward;

import java.util.List;

public interface RewardService {
    Reward createReward(String customerId, double totalAmount, String orderNo);
    List<Reward> getRewardsByCustomerId(String customerId);
    List<Double> getRewardDetails(String customerId);
//    RewardsAcc getRewardsAccOfCustomer(String customerId);
    List<Reward> getAllRewards();
}
