package com.lalith.customer.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderItem {
    private String itemId;
    private String itemName;
    private double itemPrice;
    private int quantity;
}