package tn.esprit.microservice.projet_microservice.Services;

import tn.esprit.microservice.projet_microservice.entities.Reclamation;
import tn.esprit.microservice.projet_microservice.entities.enums.Type;

import java.util.List;

public interface IReclamationServices {
    Reclamation addreclamation(Reclamation reclamation);
    Reclamation Updatereclamation(Reclamation reclamation,Long id);


    Reclamation retrievereclamation(Long id);
    List<Reclamation> retrieveAll();
    void removeReclamation(Long id);
    public List<Reclamation> getReclamationsByType(Type type);
    public List<Reclamation> getReclamationsTrieesParDateAsc();
    public List<Reclamation> getReclamationsTrieesParDateDesc();


}
