package com.esprit.microservice.commande.entities;

import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.Accessors;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "commande")  // Specify the collection name (optional, defaults to the class name)
@FieldDefaults(level = AccessLevel.PRIVATE)  // To handle field visibility
@Data
public class Commande implements Serializable {
@Id
    private String _id;
    private String nomCommande;
    private String deliveryAddress;
    private double totalPrice;
    private List<String> productIds = new ArrayList<>();
}
