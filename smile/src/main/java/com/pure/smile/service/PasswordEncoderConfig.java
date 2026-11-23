package com.pure.smile.service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PasswordEncoderConfig {

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }
}