package com.lalith.customer.servicetests;

import com.lalith.customer.model.Reward;
import com.lalith.customer.repository.RewardRepository;
import com.lalith.customer.service.RewardServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RewardServiceTests {
    @Mock
    private RewardRepository rewardRepository;

    @InjectMocks
    private RewardServiceImplementation rewardService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllRewards() {
        List<Reward> rewards = new ArrayList<>();
        rewards.add(createSampleReward("REWARD123"));
        rewards.add(createSampleReward("REWARD456"));

        when(rewardRepository.findAll()).thenReturn(rewards);

        List<Reward> result = rewardService.getAllRewards();

        verify(rewardRepository, times(1)).findAll();

        assertEquals(rewards.size(), result.size());
        assertEquals("REWARD123", result.get(0).getRewardsId());
        assertEquals("REWARD456", result.get(1).getRewardsId());
    }

    @Test
    public void testGetRewardsByCustomerId() {
        List<Reward> rewards = new ArrayList<>();
        rewards.add(createSampleReward("REWARD123"));
        rewards.add(createSampleReward("REWARD456"));

        when(rewardRepository.findByCustomerId("CUSTOMER789")).thenReturn(rewards);

        List<Reward> result = rewardService.getRewardsByCustomerId("CUSTOMER789");

        verify(rewardRepository, times(1)).findByCustomerId("CUSTOMER789");

        assertEquals(rewards.size(), result.size());
        assertEquals("REWARD123", result.get(0).getRewardsId());
        assertEquals("REWARD456", result.get(1).getRewardsId());
    }

    @Test
    public void testGetRewardsCount() {
        List<Reward> rewards = new ArrayList<>();
        rewards.add(createSampleReward("REWARD123"));
        rewards.add(createSampleReward("REWARD456"));

        when(rewardRepository.findAll()).thenReturn(rewards);

        int count = rewardService.getRewardsCount();

        verify(rewardRepository, times(1)).findAll();

        assertEquals(rewards.size(), count);
    }

    @Test
    public void testGetRewardBalanceOfCustomer() {
        List<Reward> rewards = new ArrayList<>();
        rewards.add(createSampleReward("REWARD123"));
        rewards.add(createSampleReward("REWARD456"));

        when(rewardRepository.findByCustomerId("CUSTOMER789")).thenReturn(rewards);

        int balance = rewardService.getRewardBalanceOfCustomer("CUSTOMER789");

        verify(rewardRepository, times(1)).findByCustomerId("CUSTOMER789");

        assertEquals(8, balance);
    }

    @Test
    public void testCreateReward() {
        String customerId = "CUSTOMER123";
        double orderTotal = 100.0;
        String orderNo = "ORDER123";

        Reward createdReward = rewardService.createReward(customerId, orderTotal, orderNo);

        verify(rewardRepository, times(1)).save(any(Reward.class));
    }

    @Test
    public void testCreateRewardWithRedeem() {
        String customerId = "CUSTOMER123";
        double orderTotal = 100.0;
        String orderNo = "ORDER123";
        double redeemedCoins = 10.0;

        Reward createdReward = rewardService.createRewardWithRedeem(customerId, orderTotal, orderNo, redeemedCoins);

        verify(rewardRepository, times(1)).save(any(Reward.class));
    }

    @Test
    public void testGenerateRewardsId() {
        String rewardsId = "REWARDS123";

        assertNotNull(rewardsId);
        assertEquals(10, rewardsId.length());
    }

    @Test
    public void testGetRewardDetails() {
        List<Reward> rewards = new ArrayList<>();
        rewards.add(createSampleReward("REWARD123"));
        rewards.add(createSampleReward("REWARD456"));

        when(rewardRepository.findByCustomerId("CUSTOMER789")).thenReturn(rewards);

        List<Integer> rewardDetails = rewardService.getRewardDetails("CUSTOMER789");

        verify(rewardRepository, times(1)).findByCustomerId("CUSTOMER789");

        assertEquals(10, rewardDetails.get(0));
        assertEquals(2, rewardDetails.get(1));
        assertEquals(8, rewardDetails.get(2));
    }


    private Reward createSampleReward(String rewardsId) {
        Reward reward = new Reward();
        reward.setRewardsId(rewardsId);
        reward.setOrderNo("ORDER123");
        reward.setCustomerId("CUSTOMER789");
        reward.setRewardsEarned(5.0);
        reward.setRewardsRedeemed(1.0);
        return reward;
    }
}
