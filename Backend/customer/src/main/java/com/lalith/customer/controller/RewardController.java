package com.lalith.customer.controller;

import com.lalith.customer.model.Reward;
import com.lalith.customer.service.RewardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rewards")
public class RewardController {
    private final RewardService rewardService;

    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    @PostMapping
    public ResponseEntity<Reward> createReward(@RequestBody Reward reward) {
        try {
            // Ensure that rewardsBalance is calculated based on rewardsEarned and rewardsRedeemed
            reward.setRewardsBalance(reward.getRewardsEarned() - reward.getRewardsRedeemed());

            Reward createdReward = rewardService.createReward(reward);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReward);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<List<Reward>> getRewardsByCustomerId(@PathVariable String customerId) {
        List<Reward> rewards = rewardService.getRewardsByCustomerId(customerId);
        return ResponseEntity.ok(rewards);
    }

    @GetMapping("/rewardbalance/{customerId}")
    public ResponseEntity<Double> getRewardBalance(@PathVariable String customerId) {
        double rewardBalance = rewardService.getRewardBalance(customerId);
        return ResponseEntity.ok(rewardBalance);
    }
}
