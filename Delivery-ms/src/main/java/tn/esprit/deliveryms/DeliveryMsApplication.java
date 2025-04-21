package tn.esprit.deliveryms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class DeliveryMsApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliveryMsApplication.class, args);
    }

}
