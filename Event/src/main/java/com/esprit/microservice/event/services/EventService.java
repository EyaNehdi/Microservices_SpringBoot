package com.esprit.microservice.event.services;

import com.esprit.microservice.event.entities.Event;
import com.esprit.microservice.event.repositories.IEventRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class EventService implements IEventService {

    private final IEventRepository eventRepository;

    // Ajouter un évént
    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }

    // Mettre à jour un événement
    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }



    // Supprimer un événement
    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }

    // Récupérer un événement par ID
    public Event retrieveEvent(String id) {
        return eventRepository.findById(id).orElse(null);
    }

    // Récupérer tous les événements
    public List<Event> retrieveAllEvents() {
        return (List<Event>)eventRepository.findAll();
    }

    // Méthode de notification 3 jours avant
    public void sendReminderNotifications() {
        // Calcul
        LocalDate targetDate = LocalDate.now().plusDays(3);
        System.out.println("🔔 Recherche des événements pour la date cible : " + targetDate); //

        // Récupération des événements pour la date cible
        List<Event> events = eventRepository.findByDate(targetDate);

        // Vérifie le nombre d'événements récupérés
        System.out.println("🔔 Nombre d'événements trouvés pour la date " + targetDate + " : " + events.size());

        // Si des événements sont récupérés, affiche leurs informations
        for (Event event : events) {
            System.out.println("🔔 [Rappel] L'événement \"" + event.getNomEvent()
                    + "\" aura lieu le " + event.getDate()
                    + " à " + event.getLieu());
        }


    }
//recherche 
    @Override
    public List<Event> searchEventsByNameAndLocation(String nomEvent, String lieu) {
        return eventRepository.findByNomEventIgnoreCaseAndLieuIgnoreCase(nomEvent, lieu);
    }


}
