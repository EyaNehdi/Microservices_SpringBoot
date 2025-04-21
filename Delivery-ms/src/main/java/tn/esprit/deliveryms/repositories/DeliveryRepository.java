package tn.esprit.deliveryms.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.deliveryms.entities.Delivery;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

}
