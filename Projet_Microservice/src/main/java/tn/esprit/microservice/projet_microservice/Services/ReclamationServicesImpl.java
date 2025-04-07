package tn.esprit.microservice.projet_microservice.Services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.projet_microservice.Repositories.IReclamationRepository;
import tn.esprit.microservice.projet_microservice.entities.Reclamation;
import tn.esprit.microservice.projet_microservice.entities.enums.Type;

import java.util.List;
@Service
@AllArgsConstructor
public class ReclamationServicesImpl implements IReclamationServices {

    private final IReclamationRepository reclamationRepository;


    private final EmailService emailService;

    @Override
    public Reclamation addreclamation(Reclamation reclamation) {
        Reclamation saved = reclamationRepository.save(reclamation);

        // Envoi du mail
        String subject = "Confirmation de votre réclamation";
        String body = "Bonjour,\n\nVotre réclamation a bien été reçue.\nMerci pour votre confiance.";
        emailService.sendConfirmationEmail("jihedb01@gmail.com", subject, body);


        return saved;
    }

    @Override
    public Reclamation Updatereclamation(Reclamation reclamation,Long id) {
        return reclamationRepository.save(reclamation);
    }



    @Override
    public Reclamation retrievereclamation(Long id) {
        return reclamationRepository.findById(id).orElse(null);
    }

    @Override
    public List<Reclamation> retrieveAll() {
        return (List<Reclamation>)reclamationRepository.findAll()   ;
    }

    @Override
    public void removeReclamation(Long id) {
        reclamationRepository.deleteById(id);

    }

    @Override
    public List<Reclamation> getReclamationsByType(Type type) {
        return reclamationRepository.findByTypeReclamation(type);
    }

    @Override
    public List<Reclamation> getReclamationsTrieesParDateAsc() {
        return reclamationRepository.findAllByOrderByDateAsc();
    }

    @Override
    public List<Reclamation> getReclamationsTrieesParDateDesc() {
        return reclamationRepository.findAllByOrderByDateDesc();    }
}
