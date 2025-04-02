package com.esprit.microservice.commande.repositories;

import com.esprit.microservice.commande.entities.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICommandeRepository extends JpaRepository<Commande,Integer> {
}
