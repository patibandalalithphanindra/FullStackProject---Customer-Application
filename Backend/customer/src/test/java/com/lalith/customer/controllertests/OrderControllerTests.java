package com.lalith.customer.controllertests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lalith.customer.controller.OrderController;
import com.lalith.customer.dto.OrderItem;
import com.lalith.customer.dto.OrderSubmission;
import com.lalith.customer.model.Order;
import com.lalith.customer.service.OrderService;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
public class OrderControllerTests {

    @Mock
    private OrderService orderService;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(new OrderController(orderService)).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testGetOrderItemsWithQuantity() throws Exception {
        String orderNo = "123";
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(new OrderItem());
        orderItems.add(new OrderItem());
        when(orderService.getOrderItemsByOrderNo(eq(orderNo))).thenReturn(orderItems);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/orders/" + orderNo + "/items"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<OrderItem> returnedOrderItems = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, OrderItem.class));

        assertEquals(orderItems.size(), returnedOrderItems.size());
    }

    @Test
    public void testCreateOrderWithoutRedeem() throws Exception {
        OrderSubmission orderSubmission = new OrderSubmission();
        Order order = new Order();
        order.setOrderNo("123");
        orderSubmission.setOrderModalData(order);
        orderSubmission.setWithCoinsData("No");
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(new OrderItem());
        orderSubmission.setOrderItemsData(orderItems);

        when(orderService.createOrderWithoutRedeem(eq(order), eq(orderItems))).thenReturn(order);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderSubmission)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Order createdOrder = objectMapper.readValue(content, Order.class);

        assertEquals(order.getOrderNo(), createdOrder.getOrderNo());
    }

    @Test
    public void testCreateOrderWithRedeem() throws Exception {
        OrderSubmission orderSubmission = new OrderSubmission();
        Order order = new Order();
        order.setOrderNo("123");
        orderSubmission.setOrderModalData(order);
        orderSubmission.setWithCoinsData("Yes");
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(new OrderItem());
        orderSubmission.setOrderItemsData(orderItems);

        when(orderService.createOrderWithRedeem(eq(order), eq(orderItems))).thenReturn(order);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderSubmission)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Order createdOrder = objectMapper.readValue(content, Order.class);

        assertEquals(order.getOrderNo(), createdOrder.getOrderNo());
    }

    @Test
    public void testGetAllOrders() throws Exception {
        List<Order> orders = new ArrayList<>();
        orders.add(new Order());
        orders.add(new Order());
        when(orderService.getAllOrders()).thenReturn(orders);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/orders"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<Order> returnedOrders = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, Order.class));

        assertEquals(orders.size(), returnedOrders.size());
    }

    @Test
    public void testGetOrderByOrderNo() throws Exception {
        String orderNo = "123";
        Order order = new Order();
        order.setOrderNo(orderNo);
        when(orderService.getOrderByOrderNo(eq(orderNo))).thenReturn(order);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/orders/byOrder/" + orderNo))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Order returnedOrder = objectMapper.readValue(content, Order.class);

        assertEquals(orderNo, returnedOrder.getOrderNo());
    }

    @Test
    public void testGetOrderByOrderNoNotFound() throws Exception {
        String orderNo = "nonexistent";
        when(orderService.getOrderByOrderNo(eq(orderNo))).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        mockMvc.perform(MockMvcRequestBuilders.get("/orders/byOrder/" + orderNo))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testGetOrdersByPhoneNo() throws Exception {
        String phoneNo = "1234567890";
        List<Order> orders = new ArrayList<>();
        orders.add(new Order());
        orders.add(new Order());
        when(orderService.getOrdersByPhoneNo(eq(phoneNo))).thenReturn(orders);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/orders/byPhone?phoneNo=" + phoneNo))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<Order> returnedOrders = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, Order.class));

        assertEquals(orders.size(), returnedOrders.size());
    }

    @Test
    public void testGetOrdersByCustomerId() throws Exception {
        String customerId = "456";
        List<Order> orders = new ArrayList<>();
        orders.add(new Order());
        orders.add(new Order());
        when(orderService.getOrdersByCustomerId(eq(customerId))).thenReturn(orders);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/orders/" + customerId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<Order> returnedOrders = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, Order.class));

        assertEquals(orders.size(), returnedOrders.size());
    }

    @Test
    public void testUpdateOrder() throws Exception {
        String orderNo = "123";
        Order updatedOrder = new Order();
        updatedOrder.setOrderNo(orderNo);
        updatedOrder.setOrderDate(LocalDateTime.now());
        updatedOrder.setLastModifiedTS(LocalDateTime.now());
        when(orderService.updateOrder(eq(orderNo), any(Order.class))).thenReturn(updatedOrder);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/orders/" + orderNo)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedOrder)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Order returnedOrder = objectMapper.readValue(content, Order.class);

        assertEquals(orderNo, returnedOrder.getOrderNo());
    }

    @Test
    public void testDeleteOrder() throws Exception {
        String orderNo = "123";
        doNothing().when(orderService).deleteOrder(eq(orderNo));

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.delete("/orders/" + orderNo))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        assertEquals("Order with " + orderNo + " has been deleted successfully", content);
    }

    @Test
    public void testDeleteOrderNotFound() throws Exception {
        String orderNo = "nonexistent";
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found")).when(orderService).deleteOrder(eq(orderNo));

        mockMvc.perform(MockMvcRequestBuilders.delete("/orders/" + orderNo))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testGetOrdersByCustomerIdException() throws Exception {
        String customerId = "456";
        when(orderService.getOrdersByCustomerId(eq(customerId)))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"));

        mockMvc.perform(MockMvcRequestBuilders.get("/orders/" + customerId))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError());
    }

    @Test
    public void testUpdateOrderException() throws Exception {
        String orderNo = "123";
        Order updatedOrder = new Order();
        updatedOrder.setOrderNo(orderNo);

        when(orderService.updateOrder(eq(orderNo), any(Order.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order data"));

        mockMvc.perform(MockMvcRequestBuilders.put("/orders/" + orderNo)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedOrder)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void testDeleteOrderException() throws Exception {
        String orderNo = "123";

        doThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"))
                .when(orderService).deleteOrder(eq(orderNo));

        mockMvc.perform(MockMvcRequestBuilders.delete("/orders/" + orderNo))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError());
    }

    @Test
    public void testCreateOrderWithoutRedeemException() throws Exception {
        OrderSubmission orderSubmission = new OrderSubmission();
        Order order = new Order();
        order.setOrderNo("123");
        orderSubmission.setOrderModalData(order);
        orderSubmission.setWithCoinsData("No");
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(new OrderItem());
        orderSubmission.setOrderItemsData(orderItems);

        when(orderService.createOrderWithoutRedeem(eq(order), eq(orderItems)))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"));

        mockMvc.perform(MockMvcRequestBuilders.post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderSubmission)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError());
    }

    @Test
    public void testCreateOrderWithRedeemException() throws Exception {
        OrderSubmission orderSubmission = new OrderSubmission();
        Order order = new Order();
        order.setOrderNo("123");
        orderSubmission.setOrderModalData(order);
        orderSubmission.setWithCoinsData("Yes");
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(new OrderItem());
        orderSubmission.setOrderItemsData(orderItems);

        when(orderService.createOrderWithRedeem(eq(order), eq(orderItems)))
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order data"));

        mockMvc.perform(MockMvcRequestBuilders.post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderSubmission)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }
    @Test
    public void testGetOrderCountsByStatus() throws Exception {
        Map<String, Integer> mockStatusCounts = new HashMap<>();
        mockStatusCounts.put("Created", 5);

        when(orderService.getOrderCountsByStatus()).thenReturn(mockStatusCounts);

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/orders/statuscounts")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.Created").value(5));
    }

    @Test
    public void testGetOrderCountsByStatus_StatusNotFound() throws Exception {
        when(orderService.getOrderCountsByStatus())
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Status not found"));

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/orders/statuscounts")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Status not found"));
    }

}
