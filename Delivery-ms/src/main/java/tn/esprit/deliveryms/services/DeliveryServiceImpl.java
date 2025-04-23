package tn.esprit.deliveryms.services;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.deliveryms.entities.CommandeDTO;
import tn.esprit.deliveryms.entities.Delivery;
import tn.esprit.deliveryms.entities.DeliveryStatus;
import tn.esprit.deliveryms.entities.ProductDTO;
import tn.esprit.deliveryms.repositories.DeliveryRepository;

import java.util.List;

@Service
public class DeliveryServiceImpl implements IDeliveryService {
    @Autowired
    private DeliveryRepository deliveryRepository;
    @Autowired
    private CommandeClient commandeClient;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Override
    public Delivery createDelivery(Delivery delivery, String id) {
        CommandeDTO commande = commandeClient.getCommandeById(id);
        if (commande == null) {
            throw new RuntimeException("Commande not found");
        }
        delivery.setCommandeId(id);
        delivery.setCommande(commande);
        return deliveryRepository.save(delivery);
    }

    @Override
    public Delivery getDeliveryWithCommande(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (delivery.getCommandeId() != null) {
            CommandeDTO commande = commandeClient.getCommandeById(delivery.getCommandeId());

            List<ProductDTO> produits = commandeClient.getOrderProducts(delivery.getCommandeId());
            CommandeDTO commandeDTO = new CommandeDTO(
                    commande.get_id(),
                    commande.getNomCommande(),
                    commande.getDeliveryAddress(),
                    commande.getTotalPrice(),
                    produits
            );
            delivery.setCommande(commandeDTO);
        }

        // Return the Delivery with the populated CommandeDTO
        return delivery;
    }


    @Override
    public List<Delivery> getAllDeliveries() {
        List<Delivery> deliveries = deliveryRepository.findAll();
        for (Delivery delivery : deliveries) {
            if (delivery.getCommandeId() != null) {
                try {
                    CommandeDTO commande = commandeClient.getCommandeById(delivery.getCommandeId());

                    CommandeDTO commandeDTO = new CommandeDTO(
                            commande.get_id(),
                            commande.getNomCommande(),
                            commande.getDeliveryAddress(),
                            commande.getTotalPrice(),
                            null
                    );
                    delivery.setCommande(commandeDTO);
                } catch (Exception e) {
                    delivery.setCommande(null);
                }
            }
        }
        return deliveries;
    }


    @Override
    public Delivery updateDelivery(Long id, Delivery deliveryDetails) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with ID: " + id));

        delivery.setStatus(deliveryDetails.getStatus());
        delivery.setTrackingNumber(deliveryDetails.getTrackingNumber());
        delivery.setCarrier(deliveryDetails.getCarrier());
        delivery.setDeliveryDate(deliveryDetails.getDeliveryDate());
        delivery.setNotes(deliveryDetails.getNotes());

        return deliveryRepository.save(delivery);
    }

    @Override
    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }

    @Override
    public void markAsDelivered(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElse(null);
        if (delivery != null) {
            delivery.setStatus(DeliveryStatus.DELIVERED);

            rabbitTemplate.convertAndSend("delivery.completed.queue", delivery.getCommandeId());

            deliveryRepository.save(delivery);
        }
    }

}
