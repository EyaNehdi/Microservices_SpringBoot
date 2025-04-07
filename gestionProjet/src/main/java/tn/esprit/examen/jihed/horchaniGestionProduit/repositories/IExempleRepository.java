package tn.esprit.examen.jihed.horchaniGestionProduit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.examen.jihed.horchaniGestionProduit.entities.Client;

public interface IExempleRepository extends JpaRepository<Client, Long> {
}