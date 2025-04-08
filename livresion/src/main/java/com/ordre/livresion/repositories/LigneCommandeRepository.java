package com.ordre.livresion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.ordre.livresion.models.*;

public interface LigneCommandeRepository extends JpaRepository<LigneCommande, Long> {
  List<LigneCommande> findByCommande(Commande commande);
  List<LigneCommande> findByStatutProduit(StatutProduit statut);
}