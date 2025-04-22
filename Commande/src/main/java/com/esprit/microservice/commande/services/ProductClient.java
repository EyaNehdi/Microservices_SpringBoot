package com.esprit.microservice.commande.services;

import com.esprit.microservice.commande.entities.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "GESTIONPRODUIT")
public interface ProductClient {
    @GetMapping("/produits/get/{id}")
    ProductDTO getProductById(@PathVariable String id);
}
