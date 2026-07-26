package com.fees.demo.controller;

import java.util.Map;

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

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins="*")
public class Admincontroller {
	@Autowired
	private Adminrepository rs;
	@PostMapping("/login")
	public ResponseEntity<Map<String,String>>login(@RequestBody AdminModel dd){
		return rs.findByUsername(dd.getUsername())
				.filter(u -> com.fees.demo.util.PasswordUtil.checkPassword(dd.getPassword(), u.getPassword()))
				.map(u -> ResponseEntity.ok(Map.of("role",u.getRole())))
				.orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
	}
}
