package com.pure.smile;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

// Define como as requisições à API e às páginas são autenticadas.
@Configuration
public class ApiSecurityConfig {
    @Bean
    @Order(1) // A regra de /api/** é avaliada antes da regra geral das páginas.
    SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
        return http.securityMatcher("/api/**")
                // Esta API usa HTTP Basic sem sessão; o cliente envia credenciais em cada chamada.
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // O endpoint de saúde pode ser consultado sem login.
                        .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                        // Os demais endpoints de /api/** exigem autenticação.
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    @Order(2) // Aplica-se ao que não foi atendido pela cadeia da API.
    SecurityFilterChain pageSecurity(HttpSecurity http) throws Exception {
        // As páginas usam o formulário de login do Spring.
        return http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .formLogin(Customizer.withDefaults())
                .build();
    }
}
