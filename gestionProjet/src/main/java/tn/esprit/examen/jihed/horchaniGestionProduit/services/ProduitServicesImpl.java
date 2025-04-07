package tn.esprit.examen.jihed.horchaniGestionProduit.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tn.esprit.examen.jihed.horchaniGestionProduit.entities.Produit;
import tn.esprit.examen.jihed.horchaniGestionProduit.repositories.ProduitRepo;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProduitServicesImpl implements IProduitServices {
    private final ProduitRepo produitRepo;

    @Override
    public Produit addProduit(Produit produit) {
        return produitRepo.save(produit);
    }

    @Override
    public Produit updateProduit( Produit produit) {

            return produitRepo.save(produit);

    }

    @Override
    public void deleteProduit(Long id) {
        produitRepo.deleteById(id);
    }

    @Override
    public Optional<Produit> getProduitById(Long id) {
        return produitRepo.findById(id);
    }

    @Override
    public List<Produit> getAllProduits() {
        return produitRepo.findAll();
    }
}
