package com.ordre.livresion.services;
import com.ordre.livresion.exception.ResourceNotFoundException;
import com.ordre.livresion.models.*;
import com.ordre.livresion.repositories.ProduitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduitServiceImpl implements ProduitService {
    private final ProduitRepository produitRepository;

    public ProduitServiceImpl(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    @Override
    public Produit saveProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    @Override
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    @Override
    public Produit getProduitById(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", id));
    }

    @Override
    public Produit updateProduit(Produit produit, Long id) {
        Produit existingProduit = getProduitById(id);

        existingProduit.setName(produit.getName());
        existingProduit.setPrix(produit.getPrix());
        existingProduit.setQuantity(produit.getQuantity());

        // 🔥 C'est ici que tu dois mettre à jour le dépôt aussi
        existingProduit.setDepot(produit.getDepot());

        return produitRepository.save(existingProduit);
    }


    @Override
    public void deleteProduit(Long id) {
        Produit produit = getProduitById(id);
        produitRepository.delete(produit);
    }

    @Override
    public List<Produit> getProduitsByDepotId(Long depotId) {
        return produitRepository.findByDepotId(depotId);
    }
}
