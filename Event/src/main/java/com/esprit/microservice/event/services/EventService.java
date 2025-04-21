package com.esprit.microservice.event.services;

import com.esprit.microservice.event.entities.Event;
import com.esprit.microservice.event.repositories.IEventRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    public Event updateEvent(String id, Event event) {

        Optional<Event> existingEvent = eventRepository.findById(id);
        if (existingEvent.isPresent()) {
            Event eventToUpdate = existingEvent.get();
            eventToUpdate.setNomEvent(event.getNomEvent());
            eventToUpdate.setDescription(event.getDescription());
            eventToUpdate.setLieu(event.getLieu());
            eventToUpdate.setDate(event.getDate());
            return eventRepository.save(eventToUpdate);
        } else {
            throw new RuntimeException("L'événement avec l'ID " + id + " n'existe pas.");
        }
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
//recherche with name
    @Override
    public List<Event> searchEventsByNameAndLocation(String nomEvent, String lieu) {
        return eventRepository.findByNomEventIgnoreCaseAndLieuIgnoreCase(nomEvent, lieu);
    }


    // Ajouter une méthode dans le service pour obtenir des statistiques par lieu
    public Map<String, Long> getEventStatsByLocation() {
        List<Event> events = (List<Event>) eventRepository.findAll();

        // Compter le nombre d'événements par lieu
        Map<String, Long> stats = events.stream()
                .collect(Collectors.groupingBy(Event::getLieu, Collectors.counting()));

        return stats;
    }


}
