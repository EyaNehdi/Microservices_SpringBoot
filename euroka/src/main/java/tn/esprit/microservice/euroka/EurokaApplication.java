package tn.esprit.microservice.euroka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurokaApplication {

	
	public static void main(String[] args) {
		SpringApplication.run(EurokaApplication.class, args);
	}

}
