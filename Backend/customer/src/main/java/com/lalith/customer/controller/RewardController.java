package com.lalith.customer.controller;

import com.lalith.customer.model.Reward;
import com.lalith.customer.service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/rewards")
public class RewardController {
    private final RewardService rewardService;

    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    @GetMapping("/{customerId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Reward>> getRewardsByCustomerId(@PathVariable String customerId) {
        List<Reward> rewards = rewardService.getRewardsByCustomerId(customerId);
        return ResponseEntity.ok(rewards);
    }

    @GetMapping("/rewardbalance/{customerId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Double> getRewardBalance(@PathVariable String customerId) {
        double rewardBalance = rewardService.getRewardBalance(customerId);
        return ResponseEntity.ok(rewardBalance);
    }
}
