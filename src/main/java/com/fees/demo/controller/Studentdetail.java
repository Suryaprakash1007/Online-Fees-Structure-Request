package com.fees.demo.controller;

import com.fees.demo.model.Studentdetailmodel;
import com.fees.demo.service.EmailService;
import com.fees.demo.service.Studentdetservice;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cassandra.CassandraProperties.Request;

import java.io.IOException;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class Studentdetail {

    private final Studentdetservice studentService;

    public Studentdetail(Studentdetservice studentService) {
        this.studentService = studentService;
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Studentdetailmodel> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Studentdetailmodel student = studentService.getStudentById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setStatus(status.toUpperCase());
        Studentdetailmodel updated = studentService.saveStudent(student);

        return ResponseEntity.ok(updated);
    }

    // ✅ Insert student
    @PostMapping("/ins")
    public ResponseEntity<Studentdetailmodel> createStudent(@RequestBody Studentdetailmodel student) {
        Studentdetailmodel saved = studentService.saveStudent(student);
        return ResponseEntity.ok(saved);
        
    }

    // ✅ Get all students
    @GetMapping("/pending")
    public List<Studentdetailmodel> getPendingStudents() {
        return studentService.getPendingStudents();
    }
    @GetMapping("/approved")
    public List<Studentdetailmodel> getApprovedStudents() {
        return studentService.getApprovedStudents();
    }
    @GetMapping("/rejected")
    public List<Studentdetailmodel> getRejectedStudents() {
        return studentService.getRejectedStudents();
    }

    // ✅ Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Studentdetailmodel> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    

    @PostMapping("/upload")
    public ResponseEntity<String> uploadStudent(
            @RequestParam String rollno,
            @RequestParam String name,
            @RequestParam String reason,
            @RequestParam String email,
            @RequestParam("file") MultipartFile file,@RequestParam String course,@RequestParam String department,@RequestParam String year) throws IOException {

        
        	studentService.saveStudentWithFile(rollno,name,reason,email,course,department,year,file);
        	return ResponseEntity.ok("Student uploaded succesfully");
    }
   
    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]>getFile(@PathVariable Long id){
    	Studentdetailmodel student=studentService.getFile(id);
    	return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\""+student.getFileName()+"\"").contentType(MediaType.parseMediaType(student.getFileType())).body(student.getFileData());
    }
    @Autowired
    private EmailService emailService;
// 🔥 proper injection

    @PutMapping("/{id}/status/email")
    public ResponseEntity<String> updateStatus1(@PathVariable Long id, @RequestParam String status) {
        Studentdetailmodel student = studentService.getStudentById(id).orElseThrow();

        student.setStatus(status);
        studentService.saveStudent(student);

        if ("APPROVED".equalsIgnoreCase(status)) {
            emailService.sendApprovalWithAttachment(student);
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            emailService.sendMail(
                student.getEmail(),
                "Your Request Rejected",
                "Hi " + student.getName() + ",\n\nSorry, your request has been rejected.\n\nThanks."
            );
        }

        return ResponseEntity.ok("Status updated and mail sent");
    }
    @GetMapping("/requests/student")
    public List<Studentdetailmodel> getRequestsByRollno(HttpSession session) {
    	String rollno=(String) session.getAttribute("rollno");
        return studentService.getStudentsByRollno(rollno);
    }

}
