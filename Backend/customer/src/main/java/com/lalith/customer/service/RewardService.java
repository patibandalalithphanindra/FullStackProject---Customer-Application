package com.lalith.customer.service;

import com.lalith.customer.model.Reward;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RewardService {
    Reward createReward(Reward reward);

    List<Reward> getRewardsByCustomerId(String customerId);

    double getRewardBalance(String customerId);

}
