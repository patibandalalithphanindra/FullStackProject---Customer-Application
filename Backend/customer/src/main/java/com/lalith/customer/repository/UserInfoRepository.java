package com.lalith.customer.repository;

import com.lalith.customer.model.UserInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface UserInfoRepository extends MongoRepository<UserInfo, String>{
    Optional<UserInfo> findByName(String username);
    Optional<UserInfo> findByEmail(String email);
}
