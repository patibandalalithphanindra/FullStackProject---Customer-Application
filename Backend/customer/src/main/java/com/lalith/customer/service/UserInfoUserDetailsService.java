package com.lalith.customer.service;

import com.lalith.customer.config.UserInfoUserDetails;
import com.lalith.customer.model.UserInfo;
import com.lalith.customer.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@Service
public class UserInfoUserDetailsService implements UserDetailsService {
    @Autowired
     private final UserInfoRepository userInfoRepository;

    @Autowired
    public UserInfoUserDetailsService(UserInfoRepository userInfoRepository) {
        this.userInfoRepository = userInfoRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> userInfo = userInfoRepository.findByName(username);
       return  userInfo.map(UserInfoUserDetails::new).orElseThrow(()
        -> new UsernameNotFoundException("User with " + username + " not found"));
    }

}
