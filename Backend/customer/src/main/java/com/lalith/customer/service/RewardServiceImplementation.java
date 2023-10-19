package com.lalith.customer.service;

import com.lalith.customer.model.Reward;
import com.lalith.customer.repository.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
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
        int rewardAmount = (int) Math.round(0.05 * orderTotal);

        Reward reward = new Reward();
        reward.setCustomerId(customerId);
        reward.setRewardsEarned(rewardAmount);
        reward.setRewardsRedeemed(0.0);

        String rewardsId = generateRewardsId();
        reward.setRewardsId(rewardsId);
        reward.setRewardsDate(LocalDateTime.now());
        reward.setOrderNo(orderNo);
        return rewardRepository.save(reward);
    }

    public Reward createRewardWithRedeem(String customerId, double orderTotal, String orderNo, double redeemedCoins) {
        int rewardAmount = (int) Math.round(0.05 * (orderTotal-redeemedCoins));

        Reward reward = new Reward();
        reward.setCustomerId(customerId);
        reward.setRewardsEarned(rewardAmount);
        reward.setRewardsRedeemed(Math.round(redeemedCoins));
        String rewardsId = generateRewardsId();
        reward.setRewardsId(rewardsId);
        reward.setRewardsDate(LocalDateTime.now());
        reward.setOrderNo(orderNo);
        rewardRepository.save(reward);
        return reward;
    }

    private String generateRewardsId() {
        UUID uuid = UUID.randomUUID();
        return "r" + uuid.toString().replace("-", "").substring(0, 9);
    }

    @Override
    public int getRewardsCount() {
        List<Reward> rewards = rewardRepository.findAll();
        return rewards.size();
    }

    public int getRewardBalanceOfCustomer(String customerId) {
        List<Reward> rewards = rewardRepository.findByCustomerId(customerId);

        int totalEarned = 0;
        int totalRedeemed = 0;

        for (Reward reward : rewards) {
            totalEarned += (int) reward.getRewardsEarned();
            totalRedeemed += (int) reward.getRewardsRedeemed();
        }
        return totalEarned - totalRedeemed;
    }

    public List<Integer> getRewardDetails(String customerId) {
        List<Reward> rewards = rewardRepository.findByCustomerId(customerId);

        int totalEarned = 0;
        int totalRedeemed = 0;

        for (Reward reward : rewards) {
            totalEarned += (int) reward.getRewardsEarned();
            totalRedeemed += (int) reward.getRewardsRedeemed();
        }

        int totalBalance = totalEarned - totalRedeemed;

        List<Integer> balanceList = new ArrayList<>();
        balanceList.add(totalEarned);
        balanceList.add(totalRedeemed);
        balanceList.add(totalBalance);

        return balanceList;
    }
}
