package tn.esprit.deliveryms.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public Queue deliveryCompletedQueue() {
        return new Queue("delivery.completed.queue", true); // Ensure queue is durable
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange("delivery.exchange");
    }

    @Bean
    public Binding binding(Queue deliveryCompletedQueue, TopicExchange exchange) {
        return BindingBuilder.bind(deliveryCompletedQueue).to(exchange).with("delivery.completed.#");
    }
}

