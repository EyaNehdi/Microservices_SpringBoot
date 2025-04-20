package tn.esprit.examen.jihed.horchaniGestionProduit.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.examen.jihed.horchaniGestionProduit.API.EmailService;

@RestController
@RequestMapping("/api/mail")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendMail(@RequestParam String to,
                           @RequestParam String subject,
                           @RequestParam String body) {
        emailService.sendSimpleMessage(to, subject, body);
        return "Email sent successfully";
    }
}

