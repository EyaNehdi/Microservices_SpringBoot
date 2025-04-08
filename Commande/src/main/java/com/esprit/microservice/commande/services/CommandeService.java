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
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    //export excel
    public ResponseEntity<byte[]> exportCommandesToExcel() throws IOException {
        // Fetch all commandes from the repository
        List<Commande> commandes = commandeRepository.findAll();

        // Create a workbook
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Commandes");

        // Create the header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("Nom");
        headerRow.createCell(2).setCellValue("Address");
        headerRow.createCell(3).setCellValue("Total Price");

        // Fill the sheet with data
        int rowNum = 1;
        for (Commande commande : commandes) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(commande.get_id());
            row.createCell(1).setCellValue(commande.getNomCommande());
            row.createCell(2).setCellValue(commande.getDeliveryAddress());
            row.createCell(3).setCellValue(commande.getTotalPrice());
        }

        // Write the output to a ByteArrayOutputStream
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        workbook.write(baos);
        workbook.close();

        // Prepare the response
        byte[] excelFile = baos.toByteArray();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=commandes_list.xlsx");

        return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
    }
}
