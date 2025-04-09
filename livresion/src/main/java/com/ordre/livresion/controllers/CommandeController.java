package com.ordre.livresion.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.ordre.livresion.DTO.CreateCommandeDto;
import com.ordre.livresion.DTO.UpdateCommandeDto;
import com.ordre.livresion.exception.ResourceNotFoundException;
import com.ordre.livresion.models.*;
import com.ordre.livresion.repositories.ClientRepository;
import com.ordre.livresion.repositories.CommandeRepository;
import com.ordre.livresion.repositories.UserRepository;
import com.ordre.livresion.services.CommandeService;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {
    private final CommandeService commandeService;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final CommandeRepository commandeRepository;

    public CommandeController(CommandeService commandeService, 
                            ClientRepository clientRepository,
                            CommandeRepository commandeRepository,
                            UserRepository userRepository) {
        this.commandeService = commandeService;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.commandeRepository = commandeRepository;
    }


    @GetMapping
    public List<Commande> getAllCommandes() {
        return commandeService.getAllCommandes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Long id) {
        return commandeService.getCommandeById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Commande> createCommande(@RequestBody CreateCommandeDto commandeDto) {
        // Récupérer le client
        Client client = clientRepository.findById(commandeDto.getClientId())
            .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'id: " + commandeDto.getClientId()));

        // Créer une nouvelle commande
        Commande commande = new Commande();
        commande.setClient(client);
        commande.setPayee(commandeDto.isPayee());
        commande.setRetireSurPlace(commandeDto.isRetireSurPlace());

        // Si ce n'est pas un retrait sur place, assigner le livreur
        if (!commandeDto.isRetireSurPlace() && commandeDto.getLivreurId() != null) {
            User livreur = userRepository.findById(commandeDto.getLivreurId())
                .orElseThrow(() -> new ResourceNotFoundException("Livreur non trouvé avec l'id: " + commandeDto.getLivreurId()));
            commande.setLivreur(livreur);
        }

        // Créer la commande avec ses lignes
        Commande createdCommande = commandeService.createCommande(commande, commandeDto.getLignesCommande());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCommande);
    }

    @PutMapping("/{id}")
    public Commande updateCommande(@PathVariable Long id, @RequestBody UpdateCommandeDto dto) {
        Commande commande = commandeService.getCommandeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        commande.setPayee(dto.getPayee());
        commande.setRetireSurPlace(dto.getRetireSurPlace());

        if (!dto.getRetireSurPlace() && dto.getLivreurId() != null) {
            User livreur = userRepository.findById(dto.getLivreurId())
                .orElseThrow(() -> new ResourceNotFoundException("Livreur non trouvé"));
            commande.setLivreur(livreur);
        } else {
            commande.setLivreur(null);
        }

        if (dto.getStatutCommande() != null) {
            commande.setStatutCommande(dto.getStatutCommande());
        }

        return commandeRepository.save(commande);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommande(@PathVariable Long id) {
        commandeService.deleteCommande(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/lignes/{ligneId}/statut-produit")
    @PreAuthorize("hasRole('RESPONSABLE')")
    public ResponseEntity<LigneCommande> updateStatutProduit(
            @PathVariable Long id, 
            @PathVariable Long ligneId,
            @RequestParam StatutProduit statut) {
        LigneCommande ligne = commandeService.updateStatutProduit(ligneId, statut);
        return ResponseEntity.ok(ligne);
    }

    @PutMapping("/{id}/statut-commande")
    @PreAuthorize("hasRole('COMERCIAL')")
    public Commande updateStatutCommande(@PathVariable Long id, @RequestParam StatutCommande statut) {
        return commandeService.updateStatutCommande(id, statut);
    }
    
    @GetMapping("/produit/{produitId}/depot")
    public Depot getDepotByProduit(@PathVariable Long produitId) {
        return commandeService.getDepotByProduit(produitId);
    }

    
    @GetMapping("/livreurs")
    public List<User> getAvailableLivreurs() {
        return commandeService.getAvailableLivreurs();
    }

    @GetMapping("/responsable")
    @PreAuthorize("hasRole('RESPONSABLE')")
    public List<Commande> getCommandesForResponsable(Principal principal) {
        User responsable = userRepository.findByUsername(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        return commandeService.getCommandesByResponsable(responsable);
    }

    @GetMapping("/livreurCommandes")
    @PreAuthorize("hasRole('LIVREUR')")
    public List<Commande> getCommandesForLivreur(Principal principal) {
        User livreur = userRepository.findByUsername(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        return commandeService.getCommandesByLivreur(livreur);
    }


}