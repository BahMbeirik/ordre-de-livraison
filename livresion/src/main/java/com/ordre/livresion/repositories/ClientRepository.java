package com.ordre.livresion.repositories;

import com.ordre.livresion.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}