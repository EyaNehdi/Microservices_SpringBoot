package tn.esprit.microservice.projet_microservice.Controllers;


import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.projet_microservice.Services.ReclamationServicesImpl;
import tn.esprit.microservice.projet_microservice.entities.Reclamation;
import tn.esprit.microservice.projet_microservice.entities.enums.Type;

import java.util.List;

@RequiredArgsConstructor

@RequestMapping("reclamation")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ReclamationController {
    private final ReclamationServicesImpl b;

    @PostMapping("/ajout")
    public Reclamation ajoute(@RequestBody Reclamation reclamation) {
        return b.addreclamation(reclamation);
    }

    @GetMapping("/get/{id}")
    public Reclamation get(@PathVariable Long id) {
        return b.retrievereclamation(id);
    }

    @GetMapping("/get")
    public List<Reclamation> afficheall() {
        return b.retrieveAll();
    }

    @PutMapping("/update/{id}")
    public Reclamation update(@RequestBody Reclamation r,@PathVariable Long id) {
        return b.Updatereclamation(r,id);
    }

    @DeleteMapping("/supp/{id}")
    public void delete(@PathVariable Long id) {
        b.removeReclamation(id);
    }


    @GetMapping("/type/{type}")
    public List<Reclamation> getReclamationsByType(@PathVariable("type") Type type) {
        return b.getReclamationsByType(type);
    }

    @GetMapping("/sorted/asc")
    public List<Reclamation> getReclamationsAsc() {
        return b.getReclamationsTrieesParDateAsc();
    }

    @GetMapping("/sorted/desc")
    public List<Reclamation> getReclamationsDesc() {
        return b.getReclamationsTrieesParDateDesc();
    }


}
