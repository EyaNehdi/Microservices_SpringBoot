package tn.esprit.deliveryms.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {
    private String _id;
    private String nomCommande;
    private String deliveryAddress;
    private double totalPrice;
//    private Long commandeId;
//    private String nomCommande;
    private List<ProductDTO> produits;
//    private double totalPrice;
//    private LocalDateTime dateCreated;
}
