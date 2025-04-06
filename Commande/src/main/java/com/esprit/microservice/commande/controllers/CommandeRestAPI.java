package com.esprit.microservice.commande.controllers;

import com.esprit.microservice.commande.entities.Commande;
import com.esprit.microservice.commande.services.CommandeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "\uD83D\uDCDA Commande Management")
@RestController
@RequestMapping("/commande")
@RequiredArgsConstructor
public class CommandeRestAPI {
    private final CommandeService commandeService;

    //add Commande
    @PostMapping("/add")
    public Commande ajoutCommande (@RequestBody Commande commande){
        System.out.println("Received data: " + commande);
        return commandeService.addCommande(commande);
    }

    //update Commande
    @PutMapping("/update")
    public Commande modifierCommande (@RequestBody Commande commande){
        return commandeService.updateCommande(commande);
    }
    //delete Commande
    @DeleteMapping("/delete/{id}")
    public void supprimerCommande(@PathVariable String id) {
        commandeService.deleteCommande(id);
    }

    //retrieve Commande
    @GetMapping("/get/{id}")
    public Commande recupererCommande (@PathVariable String id){
        return commandeService.retrieveCommande(id);
    }
    //retrieve all Commandes
    @GetMapping("/all")
    public List<Commande> recupererTousCommandes (){
        return commandeService.retrieveAllCommandes();
    }
}
