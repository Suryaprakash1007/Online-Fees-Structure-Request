package com.fees.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fees.demo.model.Loginmodel;
import com.fees.demo.repository.Loginrepository;
import com.fees.demo.service.Studentservice;


import com.fees.demo.security.JwtUtil;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="*")
public class LoginController {
	@Autowired
	private Loginrepository rs;
	
	@Autowired
	private Studentservice stu;
	
	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody Loginmodel request) {
        try {
            Loginmodel student = stu.getStudentByRollno(request.getRollno());
            if (student == null || !com.fees.demo.util.PasswordUtil.checkPassword(request.getPassword(), student.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            String token = jwtUtil.generateToken(student.getRollno(), "STUDENT");
            return ResponseEntity.ok(Map.of("token", token, "student", student));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
	
	@PostMapping("/ins")
    public ResponseEntity<Loginmodel> createStudent(@RequestBody Loginmodel student) {
			student.setPassword(com.fees.demo.util.PasswordUtil.hashPassword(student.getPassword()));
			Loginmodel saved = stu.saveStudent(student);
        return ResponseEntity.ok(saved);
	}
        		
	@GetMapping("/details")
    public List<Loginmodel> findByrole() {
        return stu.findByrole();
    }
	@PutMapping("/updatedstudent/{id}")
    public ResponseEntity<Loginmodel> updateRequest(@PathVariable Long id, @RequestBody Loginmodel updatedRequest) {
        return rs.findById(id).map(existingRequest -> {
        	existingRequest.setRollno(updatedRequest.getRollno());
            existingRequest.setPassword(com.fees.demo.util.PasswordUtil.hashPassword(updatedRequest.getPassword()));
            existingRequest.setName(updatedRequest.getName());
            existingRequest.setDepartment(updatedRequest.getDepartment());
            existingRequest.setYear(updatedRequest.getYear());
            existingRequest.setCourse(updatedRequest.getCourse());
            existingRequest.setEmail(updatedRequest.getEmail());
            existingRequest.setRole(updatedRequest.getRole());

            Loginmodel savedHod = rs.save(existingRequest);
            return ResponseEntity.ok(savedHod);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

	    @DeleteMapping("/{id}/del")
	    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
	        if(stu.existsById(id)) {
	            stu.deleteById(id);
	            return ResponseEntity.ok("Student deleted successfully");
	        } else {
	            return ResponseEntity.notFound().build();
	            
	        }
	    }
	    @GetMapping("/rollno/{rollno}")
	    public ResponseEntity<?> getStudentByRollno(@PathVariable String rollno) {
	        try {
	           Loginmodel student = stu.getStudentByRollno(rollno);
	            return ResponseEntity.ok(student);
	        } catch (Exception e) {
	            return ResponseEntity.status(404).body("Student not found");
	        }
	    }
}
