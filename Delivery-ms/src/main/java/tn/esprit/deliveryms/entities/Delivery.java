package tn.esprit.deliveryms.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long commandeId;

    private String address;

    private LocalDateTime deliveryDate;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    private String carrier;

    private String trackingNumber;

    private String notes;
}
