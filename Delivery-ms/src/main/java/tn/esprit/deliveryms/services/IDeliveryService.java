package tn.esprit.deliveryms.services;

import tn.esprit.deliveryms.entities.Delivery;

import java.util.List;
import java.util.Optional;

public interface IDeliveryService {

    Delivery createDelivery(Delivery delivery, String id);

    Delivery getDeliveryWithCommande(Long deliveryId);

    List<Delivery> getAllDeliveries();

    Delivery updateDelivery(Long id, Delivery deliveryDetails);

    void deleteDelivery(Long id);
}
