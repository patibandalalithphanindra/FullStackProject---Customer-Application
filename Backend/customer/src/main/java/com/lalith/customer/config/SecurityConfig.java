package com.lalith.customer.config;

import com.lalith.customer.filter.JwtAuthFilter;
import com.lalith.customer.service.UserInfoUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
   private JwtAuthFilter jwtAuthFilter;
  @Bean
    public UserDetailsService userDetailsService() {
      return new UserInfoUserDetailsService();
   }

   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       return http.csrf(AbstractHttpConfigurer::disable)
               .authorizeHttpRequests(auth ->
                       auth.requestMatchers("/user/add", "/user/authenticate")
                               .permitAll()
                               .requestMatchers("/customers/**", "/order/**", "/rewards/**")
                               .authenticated())
                               .sessionManagement(session ->
                                       session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                               )
                               .authenticationProvider(authenticationProvider())
                               .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                               .build();
   }

   @Bean
   public PasswordEncoder passwordEncoder(){
      return new BCryptPasswordEncoder();
   }

   @Bean
    public AuthenticationProvider authenticationProvider(){
       DaoAuthenticationProvider aProvider = new DaoAuthenticationProvider();
       aProvider.setUserDetailsService(userDetailsService());
       aProvider.setPasswordEncoder(passwordEncoder());
       return aProvider;
   }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
