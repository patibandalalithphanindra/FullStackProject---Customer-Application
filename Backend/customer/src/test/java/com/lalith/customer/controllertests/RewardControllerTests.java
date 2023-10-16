package com.lalith.customer.controllertests;

import com.lalith.customer.controller.RewardController;
import com.lalith.customer.model.Reward;
import com.lalith.customer.service.RewardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class RewardControllerTests {

    @Mock
    private RewardService rewardService;

    @InjectMocks
    private RewardController rewardController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllCustomers() {
        List<Reward> rewards = new ArrayList<>();
        rewards.add(new Reward());
        rewards.add(new Reward());

        when(rewardService.getAllRewards()).thenReturn(rewards);

        ResponseEntity<?> responseEntity = rewardController.getAllRewards();

        verify(rewardService, times(1)).getAllRewards();
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(rewards, responseEntity.getBody());
    }

    @Test
    public void testGetRewardsByCustomerId() {
        String customerId = "123";
        List<Reward> rewards = new ArrayList<>();
        rewards.add(new Reward());
        rewards.add(new Reward());

        when(rewardService.getRewardsByCustomerId(customerId)).thenReturn(rewards);

        ResponseEntity<List<Reward>> responseEntity = rewardController.getRewardsByCustomerId(customerId);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(rewards, responseEntity.getBody());
    }

    @Test
    public void testGetRewardBalance() {
        String customerId = "456";
        List<Integer> rewardBalance = new ArrayList<>();
        rewardBalance.add(10);
        rewardBalance.add(20);

        when(rewardService.getRewardDetails(customerId)).thenReturn(rewardBalance);

        ResponseEntity<List<Integer>> responseEntity = rewardController.getRewardBalance(customerId);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(rewardBalance, responseEntity.getBody());
    }

    @Test
    public void testGetAllCustomersWithException() {
        when(rewardService.getAllRewards()).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Rewards not found"));

        ResponseEntity<?> responseEntity = rewardController.getAllRewards();

        verify(rewardService, times(1)).getAllRewards();
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
    }
}
