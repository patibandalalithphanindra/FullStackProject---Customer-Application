package com.lalith.customer.controllertests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lalith.customer.CustomerApplication;
import com.lalith.customer.controller.CustomerController;
import com.lalith.customer.model.Customer;
import com.lalith.customer.service.CustomerService;
import com.lalith.customer.service.OrderService;
import com.lalith.customer.service.RewardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = CustomerApplication.class)
public class CustomerControllerTests {
    @Mock
    private CustomerService customerService;
    @Mock
    private RewardService rewardService;
    @Mock
    private OrderService orderService;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(new CustomerController(customerService, rewardService, orderService)).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testCreateCustomer() throws Exception {
        Customer newCustomer = new Customer();
        newCustomer.setCustomerId("456");
        when(customerService.createCustomer(any(Customer.class))).thenReturn(newCustomer);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCustomer)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Customer createdCustomer = objectMapper.readValue(content, Customer.class);

        assertEquals(newCustomer.getCustomerId(), createdCustomer.getCustomerId());
    }

    @Test
    public void testGetAllCustomers() throws Exception {
        List<Customer> customers = new ArrayList<>();
        customers.add(new Customer());
        customers.add(new Customer());
        when(customerService.getAllCustomers()).thenReturn(customers);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/customers"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<Customer> returnedCustomers = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, Customer.class));

        assertEquals(customers.size(), returnedCustomers.size());
    }

    @Test
    public void testGetCustomerByCustomerId() throws Exception {
        String customerId = "456";
        Customer customer = new Customer();
        customer.setCustomerId(customerId);
        when(customerService.getCustomerByCustomerId(customerId)).thenReturn(Optional.of(customer));

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/customers/" + customerId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Customer returnedCustomer = objectMapper.readValue(content, Customer.class);

        assertEquals(customerId, returnedCustomer.getCustomerId());
    }

    @Test
    public void testGetCustomerByCustomerIdNotFound() throws Exception {
        String customerId = "nonexistent";
        when(customerService.getCustomerByCustomerId(customerId)).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        mockMvc.perform(MockMvcRequestBuilders.get("/customers/" + customerId))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testGetCustomerByEmailId() throws Exception {
        String emailId = "test@example.com";
        Customer customer = new Customer();
        customer.setEmailId(emailId);
        when(customerService.getCustomerByEmailId(emailId)).thenReturn(Optional.of(customer));

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/customers/email?emailId=" + emailId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Customer returnedCustomer = objectMapper.readValue(content, Customer.class);

        assertEquals(emailId, returnedCustomer.getEmailId());
    }

    @Test
    public void testGetCustomerByEmailIdNotFound() throws Exception {
        String emailId = "nonexistent@example.com";
        when(customerService.getCustomerByEmailId(emailId)).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/customers/email?emailId=" + emailId))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testGetCustomerByStatus() throws Exception {
        String status = "Active";
        List<Customer> customers = new ArrayList<>();
        customers.add(new Customer());
        customers.add(new Customer());
        when(customerService.getAllCustomerByStatus(status)).thenReturn(customers);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/customers/status?status=" + status))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<Customer> returnedCustomers = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, Customer.class));

        assertEquals(customers.size(), returnedCustomers.size());
    }

    @Test
    public void testGetCustomerByStatusNotFound() throws Exception {
        String status = "NonexistentStatus";
        when(customerService.getAllCustomerByStatus(status)).thenReturn(new ArrayList<>());

        mockMvc.perform(MockMvcRequestBuilders.get("/customers/status?status=" + status))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testUpdateCustomer() throws Exception {
        String customerId = "123";
        Customer updatedCustomer = new Customer();
        updatedCustomer.setCustomerId(customerId);
        updatedCustomer.setFirstName("UpdatedName");
        when(customerService.updateCustomer(eq(customerId), any(Customer.class))).thenReturn(updatedCustomer);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/customers/" + customerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedCustomer)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Customer returnedCustomer = objectMapper.readValue(content, Customer.class);

        assertEquals(updatedCustomer.getFirstName(), returnedCustomer.getFirstName());
    }

    @Test
    public void testUpdateCustomerNotFound() throws Exception {
        String customerId = "nonexistent";
        Customer updatedCustomer = new Customer();
        updatedCustomer.setCustomerId(customerId);
        when(customerService.updateCustomer(eq(customerId), any(Customer.class))).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        mockMvc.perform(MockMvcRequestBuilders.put("/customers/" + customerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedCustomer)))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testDeleteCustomer() throws Exception {
        String customerId = "123";
        String responseMessage = "Customer with id " + customerId + " has been deleted successfully!";
        when(customerService.deleteCustomer(customerId)).thenReturn(responseMessage);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.delete("/customers/" + customerId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        assertEquals(responseMessage, content);
    }

    @Test
    public void testDeleteCustomerNotFound() throws Exception {
        String customerId = "nonexistent";
        when(customerService.deleteCustomer(customerId)).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        mockMvc.perform(MockMvcRequestBuilders.delete("/customers/" + customerId))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testGetAllCounts() throws Exception {
        int customersCount = 5;
        int rewardsCount = 10;
        int ordersCount = 15;
        List<Integer> count = new ArrayList<>();
        count.add(customersCount);
        count.add(rewardsCount);
        count.add(ordersCount);

        when(customerService.getCustomersCount()).thenReturn(customersCount);
        when(rewardService.getRewardsCount()).thenReturn(rewardsCount);
        when(orderService.getOrdersCount()).thenReturn(ordersCount);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/customers/counts"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<Integer> returnedCounts = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, Integer.class));

        assertEquals(count.size(), returnedCounts.size());
        assertEquals(customersCount, returnedCounts.get(0));
        assertEquals(rewardsCount, returnedCounts.get(1));
        assertEquals(ordersCount, returnedCounts.get(2));
    }

    @Test
    public void testCreateCustomerException() throws Exception {
        Customer newCustomer = new Customer();
        when(customerService.createCustomer(any(Customer.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"));

        mockMvc.perform(MockMvcRequestBuilders.post("/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCustomer)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError());
    }

    @Test
    public void testUpdateCustomerException() throws Exception {
        String customerId = "123";
        Customer updatedCustomer = new Customer();
        updatedCustomer.setCustomerId(customerId);

        when(customerService.updateCustomer(eq(customerId), any(Customer.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid customer data"));

        mockMvc.perform(MockMvcRequestBuilders.put("/customers/" + customerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedCustomer)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void testDeleteCustomerException() throws Exception {
        String customerId = "123";

        when(customerService.deleteCustomer(customerId))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"));

        mockMvc.perform(MockMvcRequestBuilders.delete("/customers/" + customerId))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError());
    }

    @Test
    public void testGetAllCountsExceptions() throws Exception {
        when(customerService.getCustomersCount()).thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"));
        when(rewardService.getRewardsCount()).thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"));
        when(orderService.getOrdersCount()).thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"));

        mockMvc.perform(MockMvcRequestBuilders.get("/customers/counts"))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError());
    }

    @Test
    public void testGetAllCountsSuccess() throws Exception {
        int customersCount = 5;
        int rewardsCount = 10;
        int ordersCount = 15;

        when(customerService.getCustomersCount()).thenReturn(customersCount);
        when(rewardService.getRewardsCount()).thenReturn(rewardsCount);
        when(orderService.getOrdersCount()).thenReturn(ordersCount);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/customers/counts"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<Integer> returnedCounts = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, Integer.class));

        assertEquals(3, returnedCounts.size());
        assertEquals(customersCount, returnedCounts.get(0));
        assertEquals(rewardsCount, returnedCounts.get(1));
        assertEquals(ordersCount, returnedCounts.get(2));
    }


}
