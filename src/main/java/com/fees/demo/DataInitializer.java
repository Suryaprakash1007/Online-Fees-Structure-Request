package com.fees.demo;

import com.fees.demo.model.AdminModel;
import com.fees.demo.repository.Adminrepository;
import com.fees.demo.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private Adminrepository adminRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if any admin exists in the database
        if (adminRepository.count() == 0) {
            System.out.println("No admin user found. Creating default admin user...");
            
            AdminModel defaultAdmin = new AdminModel();
            defaultAdmin.setUsername("admin");
            defaultAdmin.setPassword(PasswordUtil.hashPassword("admin123")); // Default password
            defaultAdmin.setRole("admin");
            
            adminRepository.save(defaultAdmin);
            
            System.out.println("Default admin created successfully!");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
        }
    }
}
