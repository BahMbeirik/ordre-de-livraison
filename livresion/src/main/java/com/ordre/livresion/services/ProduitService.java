package com.ordre.livresion.services;

import java.util.List;

import com.ordre.livresion.models.Produit;

public interface ProduitService {
    Produit saveProduit(Produit produit);
    List<Produit> getAllProduits();
    Produit getProduitById(Long id);
    Produit updateProduit(Produit produit, Long id);
    void deleteProduit(Long id);
    List<Produit> getProduitsByDepotId(Long depotId);
}