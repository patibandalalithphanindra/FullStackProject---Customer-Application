package com.lalith.customer.dto;
import com.lalith.customer.model.Item;
import com.lalith.customer.model.Order;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderSubmission {
    private Order orderModalData;
    public String withCoinsData;
}