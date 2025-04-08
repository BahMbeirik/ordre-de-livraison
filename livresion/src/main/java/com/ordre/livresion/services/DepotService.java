package com.ordre.livresion.services;

import java.util.List;

import com.ordre.livresion.models.Depot;

public interface DepotService {
    Depot saveDepot(Depot depot);
    List<Depot> getAllDepots();
    Depot getDepotById(Long id);
    Depot updateDepot(Depot depot, Long id);
    void deleteDepot(Long id);
}