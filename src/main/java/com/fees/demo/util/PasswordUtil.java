package com.fees.demo.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class PasswordUtil {
    
    public static String hashPassword(String password) {
        if (password == null) return null;
        // If password is already a SHA-256 base64 string (length 44), don't double hash it
        if (password.length() == 44 && password.endsWith("=")) return password;
        
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash password", e);
        }
    }
    
    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || hashedPassword == null) return false;
        // Check if the stored password was never hashed (legacy plaintext)
        if (plainPassword.equals(hashedPassword)) return true;
        
        String newHash = hashPassword(plainPassword);
        return newHash.equals(hashedPassword);
    }
}
