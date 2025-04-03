package com.esprit.microservice.commande.repositories;

import com.esprit.microservice.commande.entities.Commande;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ICommandeRepository extends MongoRepository<Commande,String> {

}
