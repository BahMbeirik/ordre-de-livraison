package com.ordre.livresion.services;

import com.ordre.livresion.repositories.*;

import jakarta.transaction.Transactional;

import com.ordre.livresion.DTO.LigneCommandeDto;
import com.ordre.livresion.exception.ResourceNotFoundException;
import com.ordre.livresion.models.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class CommandeService {
  private final CommandeRepository commandeRepository;
  private final LigneCommandeRepository ligneCommandeRepository;
  private final ProduitRepository produitRepository;
  private final ClientRepository clientRepository;
  private final DepotRepository depotRepository;
  private final UserRepository userRepository;

  public CommandeService(CommandeRepository commandeRepository, LigneCommandeRepository ligneCommandeRepository,
                       ProduitRepository produitRepository, ClientRepository clientRepository, 
                       DepotRepository depotRepository, UserRepository userRepository) {
      this.commandeRepository = commandeRepository;
      this.ligneCommandeRepository = ligneCommandeRepository;
      this.produitRepository = produitRepository;
      this.clientRepository = clientRepository;
      this.depotRepository = depotRepository;
      this.userRepository = userRepository;
  }

    public Commande createCommande(Commande commande, List<LigneCommandeDto> lignes) {
        // Générer un numéro de commande unique
        String numeroCommande = "CMD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        commande.setNumeroCommande(numeroCommande);
        
        // Si retire sur place, mettre livreur à null
        if (commande.isRetireSurPlace()) {
            commande.setLivreur(null);
        }
        
        // Sauvegarder la commande
        Commande savedCommande = commandeRepository.save(commande);
        
        // Ajouter les lignes de commande
        for (LigneCommandeDto ligneDto : lignes) {
            Produit produit = produitRepository.findById(ligneDto.getProduitId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
            Depot depot = depotRepository.findById(ligneDto.getDepotId())
                .orElseThrow(() -> new ResourceNotFoundException("Dépôt non trouvé"));
            
            savedCommande.addLigneCommande(produit, ligneDto.getQuantity(), depot);
        }
        
        return commandeRepository.save(savedCommande);
    }


    public Commande updateCommande(Long id, Commande commandeDetails) {
      Commande commande = commandeRepository.findById(id)
          .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));
      
      // Mise à jour des champs de la commande
      commande.setPayee(commandeDetails.isPayee());
      commande.setRetireSurPlace(commandeDetails.isRetireSurPlace());
      
      // Si retire sur place, mettre livreur à null
      if (commande.isRetireSurPlace()) {
          commande.setLivreur(null);
      } else {
          commande.setLivreur(commandeDetails.getLivreur());
      }
      
      // Mise à jour du statut de la commande si nécessaire
      if (commandeDetails.getStatutCommande() != null) {
          commande.setStatutCommande(commandeDetails.getStatutCommande());
      }
      
      return commandeRepository.save(commande);
  }

  @PreAuthorize("hasRole('RESPONSABLE') or hasRole('LIVREUR')")
  public LigneCommande updateStatutProduit(Long ligneId, StatutProduit statut) {
      LigneCommande ligne = ligneCommandeRepository.findById(ligneId)
          .orElseThrow(() -> new ResourceNotFoundException("Ligne de commande non trouvée"));
      
      ligne.setStatutProduit(statut);
      
      // Mettre à jour les dates sur la commande si nécessaire
      Commande commande = ligne.getCommande();
      if (statut == StatutProduit.RETIRE) {
          commande.setDateDepart(LocalDateTime.now());
      } else if (statut == StatutProduit.LIVRE) {
          commande.setDateLivraison(LocalDateTime.now());
      }
      
      // Mettre à jour le statut de la commande en fonction des statuts des produits
      updateCommandeStatusBasedOnProduits(commande);
      
      ligneCommandeRepository.save(ligne);
      return ligne;
  }

  private void updateCommandeStatusBasedOnProduits(Commande commande) {
      List<LigneCommande> lignes = commande.getLignesCommande();
      
      if (lignes.isEmpty()) {
          return;
      }
      
      // Vérifier si tous les produits sont livrés
      boolean allLivres = lignes.stream()
          .allMatch(l -> l.getStatutProduit() == StatutProduit.LIVRE);
      
      // Vérifier si tous les produits sont retirés
      boolean allRetires = lignes.stream()
          .allMatch(l -> l.getStatutProduit() == StatutProduit.RETIRE);
      
      // Vérifier si au moins un produit est en cours de livraison
      boolean anyEnCours = lignes.stream()
          .anyMatch(l -> l.getStatutProduit() == StatutProduit.RETIRE);
      
      if (allLivres) {
          commande.setStatutCommande(StatutCommande.LIVREE);
      } else if (allRetires) {
          commande.setStatutCommande(StatutCommande.EN_COURS);
      } else if (anyEnCours) {
          // Si certains produits sont retirés mais pas tous
          commande.setStatutCommande(StatutCommande.EN_COURS);
      } else {
          // Sinon, la commande est en préparation
          commande.setStatutCommande(StatutCommande.EN_PREPARATION);
      }
      
      commandeRepository.save(commande);
  }



    @PreAuthorize("hasRole('COMERCIAL')")
    public Commande updateStatutCommande(Long id, StatutCommande statut) {
        Commande commande = commandeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));
        
        commande.setStatutCommande(statut);
        return commandeRepository.save(commande);
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll() ;
    }

    public Optional<Commande> getCommandeById(Long id) {
        return commandeRepository.findById(id);
    }

    public void deleteCommande(Long id) {
        commandeRepository.deleteById(id);
    }
    
    public Depot getDepotByProduit(Long produitId) {
      Produit produit = produitRepository.findById(produitId)
          .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + produitId));
      return produit.getDepot();
    }
  
    
    public List<User> getAvailableLivreurs() {
        return userRepository.findByRole(Role.LIVREUR);
    }

    @PreAuthorize("hasRole('RESPONSABLE')")
    public List<Commande> getCommandesByResponsable(User responsable) {
        // استرجاع كل الـ depots التي هو مسؤول عنها
        List<Depot> depots = depotRepository.findByChef(responsable);
        // استخراج الـ commandes التي تحتوي على au moins une ligne commande liée à produit dans ces dépôts
        Set<Commande> commandes = new HashSet<>();
        for (Depot depot : depots) {
            List<LigneCommande> lignes = ligneCommandeRepository.findByDepot(depot);
            for (LigneCommande ligne : lignes) {
                commandes.add(ligne.getCommande());
            }
        }
        return new ArrayList<>(commandes);
    }

    @PreAuthorize("hasRole('LIVREUR')")
    public List<Commande> getCommandesByLivreur(User livreur) {
        return commandeRepository.findByLivreur(livreur);
    }

}