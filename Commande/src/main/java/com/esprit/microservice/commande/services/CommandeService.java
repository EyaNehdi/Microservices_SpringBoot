package com.esprit.microservice.commande.services;

import com.esprit.microservice.commande.entities.Commande;
import com.esprit.microservice.commande.repositories.ICommandeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CommandeService implements ICommandeService{

    private final ICommandeRepository commandeRepository;

    public Commande addCommande(Commande commande) {
        return commandeRepository.save(commande);
    }

    public Commande updateCommande(Commande commande) {
        return commandeRepository.save(commande);
    }

    public void deleteCommande(String id) {
        commandeRepository.deleteById(id);
    }
    public Commande retrieveCommande(String id) {
        return commandeRepository.findById(id).orElse(null);
    }

    public List<Commande> retrieveAllCommandes() {
        return commandeRepository.findAll();
    }
}
