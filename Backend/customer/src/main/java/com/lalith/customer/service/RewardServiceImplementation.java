package com.lalith.customer.service;

import com.lalith.customer.model.Reward;
import com.lalith.customer.repository.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RewardServiceImplementation implements RewardService {

    private final RewardRepository rewardRepository;

    @Autowired
    public RewardServiceImplementation(RewardRepository rewardRepository) {
        this.rewardRepository = rewardRepository;
    }


    @Override
    public List<Reward> getRewardsByCustomerId(String customerId) {
        List<Reward> rewards = rewardRepository.findByCustomerId(customerId);
        if (rewards.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No rewards found for customer with ID: " + customerId);
        }
        return rewards;
    }

    public Reward createReward(String customerId, double orderTotal, String orderNo) {
        double rewardAmount = 0.05 * orderTotal;

        Reward reward = new Reward();
        reward.setCustomerId(customerId);
        reward.setRewardsEarned(rewardAmount);
        reward.setRewardsRedeemed(0.0);
        reward.setRewardsBalance(rewardAmount);

        String rewardsId = generateRewardsId();
        reward.setRewardsId(rewardsId);
        reward.setRewardsDate(LocalDateTime.now());
        reward.setOrderNo(orderNo);

        return rewardRepository.save(reward);
    }

    private String generateRewardsId() {
        UUID uuid = UUID.randomUUID();
        String rewardsId = "R" + uuid.toString().replace("-", "").substring(0, 3);
        return rewardsId;
    }


    @Override
    public double getRewardBalance(String customerId) {
        List<Reward> rewards = rewardRepository.findByCustomerId(customerId);

        double totalEarned = 0;
        double totalRedeemed = 0;

        for (Reward reward : rewards) {
            totalEarned += reward.getRewardsEarned();
            totalRedeemed += reward.getRewardsRedeemed();
        }
        return totalEarned - totalRedeemed;
    }
}
