package tn.esprit.deliveryms.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.deliveryms.entities.CommandeDTO;
import tn.esprit.deliveryms.entities.Delivery;
import tn.esprit.deliveryms.repositories.DeliveryRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryServiceImpl implements IDeliveryService{
    @Autowired
    private DeliveryRepository deliveryRepository;
    @Autowired
    private CommandeClient commandeClient;

    @Override
    public Delivery createDelivery(Delivery delivery, String id) {
        CommandeDTO commande = commandeClient.getCommandeById(id);
        if (commande == null) {
            throw new RuntimeException("Commande not found");
        }
        delivery.setCommande(commande);
        return deliveryRepository.save(delivery);
    }

    @Override
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

//    @Override
//    public Optional<Delivery> getDeliveryByCommandeId(Long commandeId) {
//        return Optional.ofNullable(deliveryRepository.findByCommandeId(commandeId));
//    }

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
}
