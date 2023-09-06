package com.lalith.customer.service;

import com.lalith.customer.model.Reward;
import com.lalith.customer.repository.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RewardServiceImplementation implements RewardService {

    private final RewardRepository rewardRepository;

    @Autowired
    public RewardServiceImplementation(RewardRepository rewardRepository) {
        this.rewardRepository = rewardRepository;
    }

    @Override
    public List<Reward> getRewardsByCustomerId(String customerId) {
        return rewardRepository.findByCustomerId(customerId);
    }

    @Override
    public Reward createReward(Reward reward) {
        if (rewardRepository.findByRewardsId(reward.getRewardsId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A reward with the same rewardsId already exists.");
        }

        double rewardsBalance = reward.getRewardsEarned() - reward.getRewardsRedeemed();
        reward.setRewardsBalance(rewardsBalance);

        return rewardRepository.save(reward);
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
