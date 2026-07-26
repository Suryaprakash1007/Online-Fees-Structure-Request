package com.fees.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Allow static resources (HTML, CSS, JS, Images)
                .requestMatchers("/", "/*.html", "/*.css", "/*.js", "/assets/**", "/images/**").permitAll()
                // Allow login and registration endpoints
                .requestMatchers("/login", "/ins", "/admin/login", "/admin/verify-otp").permitAll()
                // Require specific roles for specific endpoints (Optional, but good practice)
                .requestMatchers("/api/students/pending", "/api/students/*/approve", "/api/students/*/reject", "/api/students/approved", "/api/students/rejected", "/api/admin/**").hasRole("ADMIN")
                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
