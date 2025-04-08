package com.ordre.livresion.services;

import com.ordre.livresion.models.Client;
import java.util.List;
import java.util.Optional;

public interface ClientService {
    List<Client> getAllClients();
    Optional<Client> getClientById(Long id);
    Client createClient(Client client);
    Client updateClient(Long id, Client clientDetails);
    void deleteClient(Long id);
}