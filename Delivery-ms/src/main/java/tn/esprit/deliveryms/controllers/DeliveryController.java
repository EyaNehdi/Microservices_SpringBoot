package tn.esprit.deliveryms.controllers;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tn.esprit.deliveryms.entities.Delivery;
import tn.esprit.deliveryms.services.IDeliveryService;
import tn.esprit.deliveryms.services.PDFGenerator;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/deliveries")
public class DeliveryController {

    private final IDeliveryService deliveryService;
    private final PDFGenerator pdfGenerator;

    public DeliveryController(IDeliveryService deliveryService, PDFGenerator pdfGenerator) {
        this.deliveryService = deliveryService;
        this.pdfGenerator = pdfGenerator;
    }
    // Create new delivery
    @PostMapping("/create/{id}")
    public ResponseEntity<Delivery> createDelivery(@RequestBody Delivery delivery, @PathVariable String id) {
        Delivery saved = deliveryService.createDelivery(delivery, id);
        return ResponseEntity.ok(saved);
    }

    // Get all deliveries
    @GetMapping("/getAll")
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    // Get delivery by commande ID
//    @GetMapping("/commande/{commandeId}")
//    public ResponseEntity<Delivery> getDeliveryByCommandeId(@PathVariable Long commandeId) {
//        return deliveryService.getDeliveryByCommandeId(commandeId)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }

    // Update delivery by ID
    @PutMapping("/getById/{id}")
    public ResponseEntity<Delivery> updateDelivery(
            @PathVariable Long id,
            @RequestBody Delivery updatedDelivery
    ) {
        try {
            Delivery updated = deliveryService.updateDelivery(id, updatedDelivery);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getDetails/{id}")
    public ResponseEntity<Delivery> getDeliveryWithCommande(@PathVariable Long id) {
        Delivery delivery = deliveryService.getDeliveryWithCommande(id);
        return ResponseEntity.ok(delivery);
    }

    // Delete delivery by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pdf/{id}")
    public ResponseEntity<byte[]> getDeliveryPdf(@PathVariable Long id) throws IOException {
        Delivery delivery = deliveryService.getDeliveryWithCommande(id);
        byte[] pdf = pdfGenerator.generatePDF(delivery);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.inline().filename("delivery_" + id + ".pdf").build());

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @PutMapping("/markDelivered/{deliveryId}")
    public ResponseEntity<String> completeDelivery(@PathVariable Long deliveryId) {
        try {
            deliveryService.markAsDelivered(deliveryId);

            return ResponseEntity.ok("Delivery marked as completed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to complete the delivery: " + e.getMessage());
        }
    }
}
