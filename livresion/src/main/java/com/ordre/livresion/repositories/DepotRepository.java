package com.ordre.livresion.repositories;
import com.ordre.livresion.models.*;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepotRepository extends JpaRepository<Depot, Long> {
  
}