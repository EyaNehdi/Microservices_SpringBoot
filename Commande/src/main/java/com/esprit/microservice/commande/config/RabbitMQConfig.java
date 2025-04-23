package com.esprit.microservice.commande.config;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String DELIVERY_COMPLETED_QUEUE = "delivery.completed.queue";

    @Bean
    public Queue deliveryCompletedQueue() {
        return new Queue(DELIVERY_COMPLETED_QUEUE, true);
    }
}
