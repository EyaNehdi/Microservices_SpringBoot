package com.esprit.microservice.event.controllers;

import com.esprit.microservice.event.entities.Event;
import com.esprit.microservice.event.services.EventService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
public class EventExportPDFController {

    private final EventService eventService;

   public EventExportPDFController(EventService eventService) {
      this.eventService = eventService;
  }

  //Endpoint pour exporter les événements en PDF
   @GetMapping("/event/export/pdf")
   public ResponseEntity<byte[]> exportEventsToPDF() throws IOException {
       // Récupérer tous les événements
        List<Event> events = eventService.retrieveAllEvents();


       // Créer un document PDF
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
     PdfWriter writer = new PdfWriter(baos);
     PdfDocument pdf = new PdfDocument(writer);
      Document document = new Document(pdf);

       // Ajouter un titre au document
  document.add(new Paragraph("Liste des Événements"));

       // Ajouter les détails des événements dans le PDF
  for (Event event : events) {
          document.add(new Paragraph("ID: " + event.getId()));
          document.add(new Paragraph("Nom de l'événement: " + event.getNomEvent()));
           document.add(new Paragraph("Lieu: " + event.getLieu()));
          document.add(new Paragraph("Date: " + event.getDate()));
            document.add(new Paragraph("Description: " + event.getDescription()));
          document.add(new Paragraph("--------------------------------------------------"));
       }

       // Fermer le document
   document.close();

       // Définir les en-têtes HTTP pour télécharger le fichier PDF
       HttpHeaders headers = new HttpHeaders();
       headers.add("Content-Disposition", "attachment; filename=events.pdf");

       // Retourner le fichier PDF en tant que réponse HTTP
    return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
   }
}
