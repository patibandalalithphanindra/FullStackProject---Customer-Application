package com.lalith.customer.ModelTests;

import com.lalith.customer.model.Reward;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;

public class RewardTest {

    @Test
    public void testRewardModel() {
        Reward reward = new Reward();
        reward.setRewardsKey("R123");
        reward.setRewardsId("REWARD001");
        reward.setOrderNo("ORDER123");
        reward.setCustomerId("CUST001");
        reward.setRewardsEarned(50.0);
        reward.setRewardsRedeemed(10.0);
        LocalDateTime rewardsDate = LocalDateTime.now();
        reward.setRewardsDate(rewardsDate);

        assertEquals("R123", reward.getRewardsKey());
        assertEquals("REWARD001", reward.getRewardsId());
        assertEquals("ORDER123", reward.getOrderNo());
        assertEquals("CUST001", reward.getCustomerId());
        assertEquals(50.0, reward.getRewardsEarned());
        assertEquals(10.0, reward.getRewardsRedeemed());
        assertEquals(rewardsDate, reward.getRewardsDate());
    }
}
