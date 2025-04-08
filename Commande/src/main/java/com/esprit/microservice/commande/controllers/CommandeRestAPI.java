package com.esprit.microservice.commande.controllers;

import com.esprit.microservice.commande.entities.Commande;
import com.esprit.microservice.commande.services.CommandeService;
import com.itextpdf.io.source.ByteArrayOutputStream;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from this origin
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
    @PutMapping("/update/{id}")
    public Commande modifierCommande (@PathVariable String id ,@RequestBody Commande commande){
        commande.set_id(id);
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

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCommandesToPDF() throws java.io.IOException {
        ByteArrayOutputStream pdfData = commandeService.exportCommandesToPDF();
        // Set headers for PDF download
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=commandes_list.pdf");
        headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf");

        return new ResponseEntity<>(pdfData.toByteArray(), headers, HttpStatus.OK);
    }
    //Endpoint for ascending sort
    @GetMapping("/sort/asc")
    public List<Commande> getCommandesSortedAsc(@RequestParam String field) {
        return commandeService.getCommandesSortedAsc(field);
    }

    // Endpoint for descending sort
    @GetMapping("/sort/desc")
    public List<Commande> getCommandesSortedDesc(@RequestParam String field) {
        return commandeService.getCommandesSortedDesc(field);
    }
}
