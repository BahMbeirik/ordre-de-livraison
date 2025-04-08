package com.ordre.livresion.controllers;

import com.ordre.livresion.models.User;
import com.ordre.livresion.services.UserService;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Utiliser @GetMapping sans "/" pour obtenir la liste des utilisateurs
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{username}")
    public Optional<User> getUser(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @GetMapping("/chefs")
    public ResponseEntity<List<User>> getChefs() {
        List<User> chefs = userService.getChefs();
        return new ResponseEntity<>(chefs, HttpStatus.OK);
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newRole = request.get("role");
            userService.updateUserRole(id, newRole);
            return ResponseEntity.ok().body(Map.of("message", "Role updated successfully")); // Renvoie un objet JSON
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", "Error updating role: " + e.getMessage()));
        }
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<User>> getPaginatedUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size) {
        Page<User> users = userService.getPaginatedUsers(page, size);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
}

