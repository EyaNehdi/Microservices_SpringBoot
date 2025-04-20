package tn.esprit.examen.jihed.horchaniGestionProduit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@SpringBootApplication
@EnableDiscoveryClient
public class jihedHorchaniGestionProduitsApplication {

    public static void main(String[] args) {
        SpringApplication.run(jihedHorchaniGestionProduitsApplication.class, args);
    }

}
