package com.lalith.customer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String orderKey;
    @NotNull(message = "orderNo should not be empty!")
    private String orderNo;
    private String customerId;
    private LocalDateTime orderDate;
    private String orderStatus = "Created";
    private int totalItems;
    private double orderTotal;
    private String currency;
    private LocalDateTime lastModifiedTS;
}
