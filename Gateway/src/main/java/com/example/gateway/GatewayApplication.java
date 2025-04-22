package com.example.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;

@SpringBootApplication

public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("gestionproduit", r -> r.path("/produits/**")
                        .uri("http://Gestionproduit:8089"))
                .route("Projet_Microservice", r -> r.path("/reclamation/**")
                        .uri("http://reclamation:8087"))
                .route("EVENT", r -> r.path("/event/**")
                        .uri("http://event:8088"))
                .route("COMMANDE", r -> r.path("/commande/**")
                        .uri("http://commandeService:8066"))
                .route("delivery-ms", r -> r.path("/deliveries/**")
                        .uri("lb://DELIVERY-MS"))
                .build();
    }

}
