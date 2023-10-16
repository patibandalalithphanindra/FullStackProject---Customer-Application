package com.lalith.customer.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "customers")
public class Customer {
        @Id
        private String customerKey;
        @NotNull(message = "customerId should not be empty!")
        private String customerId;
        private String firstName;
        private String lastName;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String zipCode;
        private String country;
        @Pattern(regexp="\\d{10}", message="Phone number should be 10 digits")
        private String phoneNo;
        @Email(message = "Email should be in a valid format")
        private String emailId;
        private String status = "Active";
}
