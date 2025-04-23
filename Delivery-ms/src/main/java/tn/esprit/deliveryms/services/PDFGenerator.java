package tn.esprit.deliveryms.services;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Service;
import tn.esprit.deliveryms.entities.Delivery;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;

@Service
public class PDFGenerator {

    public byte[] generatePDF(Delivery delivery) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try (PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdfDocument = new PdfDocument(writer);
             Document document = new Document(pdfDocument)) {

            addTitleText(document, "Delivery Invoice - #" + delivery.getId());
            addTitleImage(document, delivery.getCommande().getDeliveryAddress(), true);
            addDeliveryTable(document, delivery);
        }
        return outputStream.toByteArray();
    }

    private void addTitleImage(Document document, String titleImage, boolean isExternalImg) {
        try {
            Image image = isExternalImg
                    ? new Image(ImageDataFactory.create(new URL(titleImage)))
                    : new Image(ImageDataFactory.create(titleImage));

            image.setWidth(100);
            image.setTextAlignment(TextAlignment.LEFT);
            document.add(image);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error retrieving image: " + e.getMessage());
        }
    }

    private void addTitleText(Document document, String titleText) {
        Paragraph paragraph = new Paragraph(titleText)
                .setBold()
                .setFontSize(20)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
        document.add(paragraph);
    }

    private void addDeliveryTable(Document document, Delivery delivery) {
        Table table = new Table(2);

        table.addCell("Delivery ID");
        table.addCell(String.valueOf(delivery.getId()));

        table.addCell("Address");
        table.addCell(delivery.getCommande().getDeliveryAddress());

        table.addCell("Carrier");
        table.addCell(delivery.getCarrier());

        table.addCell("Tracking Number");
        table.addCell(delivery.getTrackingNumber());

        table.addCell("Delivery Date");
        table.addCell(String.valueOf(delivery.getDeliveryDate()));

        table.addCell("Status");
        table.addCell(String.valueOf(delivery.getStatus()));

        if (delivery.getCommande() != null) {
            table.addCell("Commande Name");
            table.addCell(delivery.getCommande().getNomCommande());

            table.addCell("Total Price");
            table.addCell(String.valueOf(delivery.getCommande().getTotalPrice()));
        }

        document.add(table);
    }
}