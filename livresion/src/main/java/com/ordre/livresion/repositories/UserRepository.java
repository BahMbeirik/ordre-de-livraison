package com.ordre.livresion.repositories;

import com.ordre.livresion.models.Role;
import com.ordre.livresion.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByUsernameContainingIgnoreCase(String query);
    List<User> findByRole(Role role);
    
}