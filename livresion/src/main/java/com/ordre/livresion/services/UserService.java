package com.ordre.livresion.services;

import com.ordre.livresion.models.Role;
import com.ordre.livresion.models.User;
import com.ordre.livresion.repositories.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User addUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void updateUserRole(Long id, String newRole) {
      User user = userRepository.findById(id)
              .orElseThrow(() -> new RuntimeException("User not found"));
      user.setRole(Role.valueOf(newRole)); // Assurez-vous que UserRole est un enum
      userRepository.save(user);
  }

  // public void updateUserPassword(Long id, String newPassword) {
  //     User user = userRepository.findById(id)
  //             .orElseThrow(() -> new RuntimeException("User not found"));
  //     user.setPassword(newPassword);
  //     userRepository.save(user);
  // }

  public Page<User> getPaginatedUsers(int page, int size) {
    PageRequest pageable = PageRequest.of(page, size);
    return userRepository.findAll(pageable);
  }

  public List<User> searchUsers(String query) {
    return userRepository.findByUsernameContainingIgnoreCase(query);
}

public List<User> getChefs() {
  return userRepository.findByRole(Role.RESPONSABLE);
}
  
}

