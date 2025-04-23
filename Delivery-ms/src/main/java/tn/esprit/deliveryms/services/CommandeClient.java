package tn.esprit.deliveryms.services;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.deliveryms.entities.CommandeDTO;
import tn.esprit.deliveryms.entities.ProductDTO;

import java.util.List;

@FeignClient(name = "COMMANDE")
public interface CommandeClient {
    @GetMapping("/commande/get/{id}")
    CommandeDTO getCommandeById(@PathVariable("id") String id);
    @GetMapping("/commande/viewProducts/{commandeId}")
    List<ProductDTO> getOrderProducts(@PathVariable("commandeId") String commandeId);
}
