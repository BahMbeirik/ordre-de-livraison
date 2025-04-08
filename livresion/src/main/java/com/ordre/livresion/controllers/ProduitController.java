package com.ordre.livresion.controllers;


import com.ordre.livresion.models.Produit;
import com.ordre.livresion.services.ProduitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {
    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @PostMapping
    public ResponseEntity<Produit> createProduit(@RequestBody Produit produit) {
        Produit savedProduit = produitService.saveProduit(produit);
        return new ResponseEntity<>(savedProduit, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Produit>> getAllProduits() {
        List<Produit> produits = produitService.getAllProduits();
        return new ResponseEntity<>(produits, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable Long id) {
        Produit produit = produitService.getProduitById(id);
        return new ResponseEntity<>(produit, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable Long id, @RequestBody Produit produit) {
        Produit updatedProduit = produitService.updateProduit(produit, id);
        return new ResponseEntity<>(updatedProduit, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/depot/{depotId}")
    public ResponseEntity<List<Produit>> getProduitsByDepotId(@PathVariable Long depotId) {
        List<Produit> produits = produitService.getProduitsByDepotId(depotId);
        return new ResponseEntity<>(produits, HttpStatus.OK);
    }
}

