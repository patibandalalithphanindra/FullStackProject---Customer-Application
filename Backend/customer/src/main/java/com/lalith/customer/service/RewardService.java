package com.lalith.customer.service;

import com.lalith.customer.model.Reward;

import java.util.List;

public interface RewardService {
    Reward createReward(String customerId, double totalAmount, String orderNo);
    Reward createRewardWithRedeem(String customerId, double totalAmount, String orderNo,double redeemBalance);
    List<Reward> getRewardsByCustomerId(String customerId);
    List<Integer> getRewardDetails(String customerId);
    int getRewardBalanceOfCustomer(String customerId);
    List<Reward> getAllRewards();
    int getRewardsCount();
}