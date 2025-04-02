package com.esprit.microservice.commande.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Document
@FieldDefaults(level= AccessLevel.PRIVATE)
public class Commande implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idCommande;
    String nomCommande;
    String deliveryAddress;
    double totalPrice;

}
