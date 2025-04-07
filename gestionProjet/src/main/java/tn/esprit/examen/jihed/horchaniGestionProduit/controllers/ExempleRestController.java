package tn.esprit.examen.jihed.horchaniGestionProduit.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.examen.jihed.horchaniGestionProduit.entities.Client;
import tn.esprit.examen.jihed.horchaniGestionProduit.services.IExempleServices;

@RequiredArgsConstructor
@RequestMapping("examen")
@RestController
public class ExempleRestController {
    private final IExempleServices services;

    @PostMapping("/add")
    public Client add(@RequestBody Client client){
        return  services.add(client);
    }
}
