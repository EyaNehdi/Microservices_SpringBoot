package com.esprit.microservice.commande.services;

import com.esprit.microservice.commande.entities.Commande;
import com.esprit.microservice.commande.repositories.ICommandeRepository;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.kernel.geom.PageSize;
import java.io.IOException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.List;

@AllArgsConstructor
@Service
public class CommandeService implements ICommandeService{

    private final ICommandeRepository commandeRepository;

    public Commande addCommande(Commande commande) {
        System.out.println("Received data: " + commande);
        return commandeRepository.save(commande);
    }

    public Commande updateCommande(Commande commande) {
        return commandeRepository.save(commande);
    }

    public void deleteCommande(String id) {
        System.out.println("Deleting commande with ID: " + id);
        commandeRepository.deleteById(id);
    }

    public Commande retrieveCommande(String id) {
        return commandeRepository.findById(id).orElse(null);
    }

    public List<Commande> retrieveAllCommandes() {
        return commandeRepository.findAll();
    }

    // Generate PDF of commandes list
    public ByteArrayOutputStream exportCommandesToPDF() throws IOException {
        // ByteArrayOutputStream to hold the PDF content
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Set up PdfWriter and PdfDocument for iText 7
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDocument = new PdfDocument(writer);

        // Create Document object (iText 7 uses Document for content)
        Document document = new Document(pdfDocument, PageSize.A4);

        // Add title to PDF
        document.add(new Paragraph("Commandes List").setFontSize(18).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));

        // Fetch commandes from the repository
        List<Commande> commandes = commandeRepository.findAll();

        // Add each commande to the PDF
        for (Commande commande : commandes) {
            document.add(new Paragraph("ID: " + commande.get_id()));
            document.add(new Paragraph("Nom: " + commande.getNomCommande()));
            document.add(new Paragraph("Address: " + commande.getDeliveryAddress()));
            document.add(new Paragraph("Total Price: " + commande.getTotalPrice()));
            document.add(new Paragraph("------------------------------------------------------"));
        }

        // Close the document (finalizes the PDF)
        document.close();

        // Return the generated PDF content as a byte array
        return baos;
    }
    // Method to fetch sorted commandes in ascending order
    public List<Commande> getCommandesSortedAsc(String field) {
        return commandeRepository.findAll(Sort.by(Sort.Order.asc(field)));
    }

    // Method to fetch sorted commandes in descending order
    public List<Commande> getCommandesSortedDesc(String field) {
        return commandeRepository.findAll(Sort.by(Sort.Order.desc(field)));
    }
}
