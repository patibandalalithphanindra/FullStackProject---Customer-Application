package com.lalith.customer.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "items")
public class Item {
    private String itemId;
    private String itemName;
    private double itemPrice;
}
