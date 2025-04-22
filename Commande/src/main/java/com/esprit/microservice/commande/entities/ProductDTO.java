package com.esprit.microservice.commande.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String nomProduit;
    private String description;
    private float prixUnitaire;
    private String imageUrl;
}
