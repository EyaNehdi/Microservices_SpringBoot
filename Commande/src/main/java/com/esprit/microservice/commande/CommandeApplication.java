package com.esprit.microservice.commande;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
//@EnableDiscoveryClient
public class CommandeApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommandeApplication.class, args);
    }

}
