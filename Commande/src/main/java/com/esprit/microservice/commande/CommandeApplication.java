package com.esprit.microservice.commande;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableRabbit
@EnableFeignClients
@SpringBootApplication
@EnableDiscoveryClient
public class CommandeApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommandeApplication.class, args);
    }

}
