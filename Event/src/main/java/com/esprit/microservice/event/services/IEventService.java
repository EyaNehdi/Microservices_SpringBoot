package com.esprit.microservice.event.services;

import com.esprit.microservice.event.entities.Event;

import java.util.List;

public interface IEventService {

    // Ajouter un événement
    Event addEvent(Event event);

    // Mettre à jour un événement
    Event updateEvent(Event event);

    // Supprimer un événement
    void deleteEvent(String id);

    // Récupérer un événement par ID
    Event retrieveEvent(String id);

    // Récupérer tous les événements
    List<Event> retrieveAllEvents();

//notif
    void sendReminderNotifications();


    List<Event> searchEventsByNameAndLocation(String nomEvent, String lieu);


}
