package com.ordre.livresion.repositories;
import com.ordre.livresion.models.*;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepotRepository extends JpaRepository<Depot, Long> {
  List<Depot> findByChef(User chef);
}