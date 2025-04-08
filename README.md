<h2 align="center">
 Microservice Project
 </h2> 

# Technologies and Architecture

This project follows a Microservices Architecture, where different services are developed and deployed independently. Each service has its own responsibility, communicates with other services via APIs, and can be scaled individually.

## Key Benefits of Microservices:

1️⃣ Eureka Server (Service Discovery)
Purpose: Acts as a registry where all microservices register themselves. It helps with service discovery and load balancing.
When a service wants to communicate with another service, it queries Eureka for the available instances.
Key Dependencies: spring-cloud-starter-netflix-eureka-server

2️⃣ API Gateway (Spring Cloud Gateway)
Purpose: Serves as the entry point for all client requests.
Routing: Directs requests to the appropriate microservices.
Security: Handles authentication and authorization (integrates with Keycloak for security).
*Clients send requests to the gateway.
**The gateway forwards requests to the appropriate microservices using Eureka service discovery.
Key Dependencies: spring-cloud-starter-gateway, spring-cloud-starter-netflix-eureka-client

3️⃣ Commande Service
Purpose: Commande management
Exposes REST APIs for order management.
Uses MongoDB for data persistence.
Registers with Eureka for service discovery.
Communicates with Gateway for client access.

Key Dependencies: spring-boot-starter-web, spring-boot-starter-data-mongodb, spring-cloud-starter-netflix-eureka-client

4️⃣ Keycloak (Identity and Access Management)

Purpose: Provides authentication and authorization services.
Keycloak issues JWT tokens.
Database: Uses MySQL for storing users, roles, and realms.
Key Dependencies: keycloak-spring-boot-starter, spring-security-oauth2


This architecture ensures a secure, scalable, and maintainable microservices-based system! 🚀

### Endpoints available : 
- /commande/add (POST) | Add a new commande
- /commande/all (GET) | Get all commandes
- /commande/update/{id} (PUT) | Update a commande by id
- /commande/delete/{id} (DELETE) | Delete a commande by id
- /commande/get/{id} (GET) | Get a commande by id
- /commande/export (GET) | Export all commandes to PDF
- /commande/excel (GET) | Export all commandes to Excel
