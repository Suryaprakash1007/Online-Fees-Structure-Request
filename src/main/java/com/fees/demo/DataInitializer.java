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
        // Check if the specific admin exists in the database
        if (adminRepository.findByUsername("ishankishen454545@gmail.com").isEmpty()) {
            System.out.println("Admin user ishankishen454545@gmail.com not found. Creating...");
            
            AdminModel defaultAdmin = new AdminModel();
            defaultAdmin.setUsername("ishankishen454545@gmail.com");
            defaultAdmin.setPassword(PasswordUtil.hashPassword("ishankishen@123"));
            defaultAdmin.setRole("admin");
            
            adminRepository.save(defaultAdmin);
            System.out.println("Admin created successfully!");
        }
    }
}
