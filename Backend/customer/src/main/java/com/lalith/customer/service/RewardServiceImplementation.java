package com.lalith.customer.service;

import com.lalith.customer.model.Reward;
import com.lalith.customer.repository.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RewardServiceImplementation implements RewardService {

   @Autowired
   private final RewardRepository rewardRepository;

    @Autowired
    public RewardServiceImplementation(RewardRepository rewardRepository) {
        this.rewardRepository = rewardRepository;
    }

    @Override
    public Reward createReward(Reward reward) {
        reward.setRewardsBalance(reward.getRewardsEarned() - reward.getRewardsRedeemed());
        return rewardRepository.save(reward);
    }

    @Override
    public List<Reward> getRewardsByCustomerId(String customerId) {
        return rewardRepository.findByCustomerId(customerId);
    }


    @Override
    public double getRewardBalance(String customerId) {
        List<Reward> rewards = rewardRepository.findByCustomerId(customerId);

        double totalEarned = 0.0;
        double totalRedeemed = 0.0;

        for (Reward reward : rewards) {
            totalEarned += reward.getRewardsEarned();
            totalRedeemed += reward.getRewardsRedeemed();
        }

        return totalEarned - totalRedeemed;
    }

}
