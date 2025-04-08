package com.ordre.livresion.controllers;

import com.ordre.livresion.models.Depot;
import com.ordre.livresion.services.DepotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/depots")
public class DepotController {
    private final DepotService depotService;

    public DepotController(DepotService depotService) {
        this.depotService = depotService;
    }

    @PostMapping
    public ResponseEntity<?> createDepot(@RequestBody Depot depot) {
        try {
            Depot savedDepot = depotService.saveDepot(depot);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDepot);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating depot: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Depot>> getAllDepots() {
        List<Depot> depots = depotService.getAllDepots();
        return new ResponseEntity<>(depots, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Depot> getDepotById(@PathVariable Long id) {
        Depot depot = depotService.getDepotById(id);
        return new ResponseEntity<>(depot, HttpStatus.OK);
    }

    @PutMapping(
        value = "/{id}",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> updateDepot(
        @PathVariable Long id, 
        @RequestBody Depot depot
    ) {
        try {
            Depot updatedDepot = depotService.updateDepot(depot, id);
            return ResponseEntity.ok(updatedDepot);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepot(@PathVariable Long id) {
        depotService.deleteDepot(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}

