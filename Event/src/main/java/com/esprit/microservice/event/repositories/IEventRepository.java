package com.esprit.microservice.event.repositories;

import com.esprit.microservice.event.entities.Event;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


public interface IEventRepository extends CrudRepository<Event, String> {

    List<Event> findByDate(LocalDate date);
    List<Event> findByNomEventIgnoreCaseAndLieuIgnoreCase(String nomEvent, String lieu);

}


