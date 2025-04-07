package tn.esprit.examen.jihed.horchaniGestionProduit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.examen.jihed.horchaniGestionProduit.entities.Client;
import tn.esprit.examen.jihed.horchaniGestionProduit.entities.Produit;

public interface ProduitRepo extends JpaRepository<Produit, Long> {
}
