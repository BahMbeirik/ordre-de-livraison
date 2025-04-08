package com.ordre.livresion.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ordre.livresion.models.*;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
  List<Commande> findByLivreur(User livreur);
  List<Commande> findByStatutCommande(StatutCommande statut);
  Optional<Commande> findByNumeroCommande(String numeroCommande);
}