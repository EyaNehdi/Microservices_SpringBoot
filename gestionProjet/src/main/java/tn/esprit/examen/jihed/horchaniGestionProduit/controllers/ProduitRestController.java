package tn.esprit.examen.jihed.horchaniGestionProduit.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.examen.jihed.horchaniGestionProduit.entities.Produit;
import tn.esprit.examen.jihed.horchaniGestionProduit.services.IProduitServices;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@RequestMapping("/produits")
@RestController
public class ProduitRestController {
    private final IProduitServices services;

    @PostMapping("/add")
    public Produit add(@RequestBody Produit produit) {
        return services.addProduit(produit);
    }

    @PutMapping("/update")
    public Produit update( @RequestBody Produit produit) {
        return services.updateProduit( produit);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        services.deleteProduit(id);
    }

    @GetMapping("/get/{id}")
    public Optional<Produit> getById(@PathVariable Long id) {
        return services.getProduitById(id);
    }

    @GetMapping("/all")
    public List<Produit> getAll() {
        return services.getAllProduits();
    }
}
