package com.esprit.microservice.event.controllers;

import com.esprit.microservice.event.entities.Event;
import com.esprit.microservice.event.services.EventService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "\uD83D\uDCC5 Event Management")
@RestController
@RequestMapping("/event")
@RequiredArgsConstructor
public class EventRestAPI {

    private final EventService eventService;

    //  Ajouter un event
    @PostMapping("/add")
    public Event ajouterEvent(@RequestBody Event event) {
        return eventService.addEvent(event);
    }


    @PutMapping("/update")
    public Event modifierEvent(@RequestBody Event event) {
        return eventService.updateEvent(event);
    }

    // Supprimer un event
    @DeleteMapping("/delete/{id}")
    public void supprimerEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
    }


    @GetMapping("/get/{id}")
    public Event recupererEvent(@PathVariable String id) {
        return eventService.retrieveEvent(id);
    }


    @GetMapping("/all")
    public List<Event> recupererTousEvents() {
        return eventService.retrieveAllEvents();
    }

    @GetMapping("/notify/3days")
    public void envoyerNotifications3Jours() {
        eventService.sendReminderNotifications();
    }



   @GetMapping("/search")
    public List<Event> searchByEventNameAndLocation(@RequestParam String nomEvent, @RequestParam String lieu) {
      return eventService.searchEventsByNameAndLocation(nomEvent, lieu);
  }



}
