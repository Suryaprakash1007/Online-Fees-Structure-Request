package com.fees.demo.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fees.demo.model.AdminModel;
import com.fees.demo.repository.Adminrepository;
import com.fees.demo.security.JwtUtil;
import com.fees.demo.service.EmailService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins="*")
public class Admincontroller {
	@Autowired
	private Adminrepository rs;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private EmailService emailService;

	@PostMapping("/login")
	public ResponseEntity<Map<String,String>> login(@RequestBody AdminModel dd){
		Optional<AdminModel> adminOpt = rs.findByUsername(dd.getUsername());
		
		if (adminOpt.isPresent() && com.fees.demo.util.PasswordUtil.checkPassword(dd.getPassword(), adminOpt.get().getPassword())) {
			AdminModel admin = adminOpt.get();
			
			// Generate 6 digit OTP
			String otp = String.format("%06d", new Random().nextInt(999999));
			admin.setOtp(otp);
			admin.setOtpExpiration(LocalDateTime.now().plusMinutes(5));
			rs.save(admin);
			
			// Send OTP via email
			emailService.sendMail(
					admin.getUsername(), 
					"Admin Login OTP - Online Fees Portal", 
					"Your One-Time Password for admin login is: " + otp + "\n\nThis code will expire in 5 minutes."
			);
			
			return ResponseEntity.ok(Map.of(
				"message", "OTP sent", 
				"requireOtp", "true",
				"role", admin.getRole()
			));
		}
		
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}
	
	@PostMapping("/verify-otp")
	public ResponseEntity<Map<String,String>> verifyOtp(@RequestBody Map<String, String> payload){
		String username = payload.get("username");
		String otp = payload.get("otp");
		
		Optional<AdminModel> adminOpt = rs.findByUsername(username);
		
		if (adminOpt.isPresent()) {
			AdminModel admin = adminOpt.get();
			
			if (admin.getOtp() != null && admin.getOtp().equals(otp)) {
				if (admin.getOtpExpiration() != null && admin.getOtpExpiration().isAfter(LocalDateTime.now())) {
					// OTP is correct and valid
					// Clear OTP
					admin.setOtp(null);
					admin.setOtpExpiration(null);
					rs.save(admin);
					
					// Generate JWT
					String token = jwtUtil.generateToken(admin.getUsername(), admin.getRole());
					return ResponseEntity.ok(Map.of("role", admin.getRole(), "token", token));
				} else {
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "OTP Expired"));
				}
			}
		}
		
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid OTP"));
	}
}
