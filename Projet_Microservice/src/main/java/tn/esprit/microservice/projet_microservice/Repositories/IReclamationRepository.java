package tn.esprit.microservice.projet_microservice.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import tn.esprit.microservice.projet_microservice.entities.Reclamation;
import tn.esprit.microservice.projet_microservice.entities.enums.Type;

import java.util.List;

public interface IReclamationRepository extends CrudRepository<Reclamation, Long> {
    List<Reclamation> findByTypeReclamation(Type typeReclamation);
    List<Reclamation> findAllByOrderByDateAsc();
    List<Reclamation> findAllByOrderByDateDesc();
}
