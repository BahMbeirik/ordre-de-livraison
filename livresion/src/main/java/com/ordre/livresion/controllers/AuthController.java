package com.ordre.livresion.controllers;

import com.ordre.livresion.models.Role;
import com.ordre.livresion.models.User;
import com.ordre.livresion.repositories.UserRepository;
import com.ordre.livresion.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser.isPresent() && passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername(), foundUser.get().getRole().name());
            // Return the token and role in an object
            return ResponseEntity.ok(new AuthResponse(token, foundUser.get().getRole().name()));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // AuthResponse class to wrap the token and role
    public class AuthResponse {
        private String token;
        private String role;

        public AuthResponse(String token, String role) {
            this.token = token;
            this.role = role;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists")); // Renvoie un objet JSON
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Définir le rôle par défaut si aucun rôle n'est fourni
        if (user.getRole() == null) {
            user.setRole(Role.LIVREUR); // Assurez-vous que UserRole est un enum
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully")); // Renvoie un objet JSON
    }
}