package com.ordre.livresion.services;


import com.ordre.livresion.exception.ResourceNotFoundException;
import com.ordre.livresion.models.Depot;
import com.ordre.livresion.models.Produit;
import com.ordre.livresion.models.User;
import com.ordre.livresion.repositories.DepotRepository;
import com.ordre.livresion.repositories.ProduitRepository;
import com.ordre.livresion.repositories.UserRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DepotServiceImpl implements DepotService {
    private final DepotRepository depotRepository;
    private final ProduitRepository produitRepository;
    private final UserRepository userRepository;

    public DepotServiceImpl(DepotRepository depotRepository, 
                       ProduitRepository produitRepository,
                       UserRepository userRepository) {
    this.depotRepository = depotRepository;
    this.produitRepository = produitRepository;
    this.userRepository = userRepository;
}

    
    @Override
    public Depot saveDepot(Depot depot) {
        // Gestion du chef
        Long chefId = depot.getChef().getId();
        User chef = userRepository.findById(chefId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", chefId));
        depot.setChef(chef);

        // Gestion des produits
        List<Produit> produits = depot.getProduits();
        if (produits != null && !produits.isEmpty()) {
            List<Produit> attachedProduits = new ArrayList<>();
            for (Produit p : produits) {
                Produit produit = produitRepository.findById(p.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", p.getId()));
                produit.setDepot(depot); // on lie le produit au dépôt
                attachedProduits.add(produit);
            }
            depot.setProduits(attachedProduits);
        }

        return depotRepository.save(depot);
    }


    @Override
    public List<Depot> getAllDepots() {
        return depotRepository.findAll();
    }

    @Override
    public Depot getDepotById(Long id) {
        return depotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Depot", "id", id));
    }

    @Override
public Depot updateDepot(Depot depot, Long id) {
    Depot existingDepot = getDepotById(id);
    existingDepot.setName(depot.getName());

    // Mise à jour du chef
    if (depot.getChef() != null && depot.getChef().getId() != null) {
        User chef = userRepository.findById(depot.getChef().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", depot.getChef().getId()));
        existingDepot.setChef(chef);
    }

    // Mise à jour des produits
    List<Produit> produits = depot.getProduits();
    if (produits != null && !produits.isEmpty()) {
        List<Produit> attachedProduits = new ArrayList<>();
        for (Produit p : produits) {
            Produit produit = produitRepository.findById(p.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", p.getId()));
            produit.setDepot(existingDepot); // on lie au dépôt existant
            attachedProduits.add(produit);
        }
        existingDepot.setProduits(attachedProduits);
    }

    return depotRepository.save(existingDepot);
}


    @Override
    public void deleteDepot(Long id) {
        Depot depot = getDepotById(id);
        depotRepository.delete(depot);
    }


    
}