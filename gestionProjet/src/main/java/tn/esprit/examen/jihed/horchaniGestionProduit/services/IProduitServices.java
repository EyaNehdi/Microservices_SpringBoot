package tn.esprit.examen.jihed.horchaniGestionProduit.services;

import tn.esprit.examen.jihed.horchaniGestionProduit.entities.Produit;
import java.util.List;
import java.util.Optional;

public interface IProduitServices {
    Produit addProduit(Produit produit);
    Produit updateProduit( Produit produit);
    void deleteProduit(Long id);
    Optional<Produit> getProduitById(Long id);
    List<Produit> getAllProduits();
}
