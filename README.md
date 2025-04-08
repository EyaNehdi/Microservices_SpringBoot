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

3️⃣ Reclamation Service

Exposes REST APIs for order management.
Uses MySQL for data persistence.
Registers with Eureka for service discovery.
Communicates with Gateway for client access.

Key Dependencies: spring-boot-starter-web, mysql-connector-j, spring-cloud-starter-netflix-eureka-client

4️⃣ Keycloak (Identity and Access Management)

Purpose: Provides authentication and authorization services.
Keycloak issues JWT tokens.
Database: Uses MySQL for storing users, roles, and realms.
Key Dependencies: keycloak-spring-boot-starter, spring-security-oauth2


This architecture ensures a secure, scalable, and maintainable microservices-based system! 🚀

### Endpoints available : 
- /reclamation/ajout (POST) | Add a new Reclamation
- /reclamation/get (GET) | Get all Reclamation
- /reclamation/update/{id} (PUT) | Update a reclamation by id
- /reclamation/supp/{id} (DELETE) | Delete a reclamation by id
- /reclamation/get/{id} (GET) | Get a reclamation by id
- /reclamation/{id}/pdf (GET) | Export  reclamation to PDF
- /reclamation/sorted/desc (GET) | sort reclamation by date in Asc order
-  /reclamation/sorted/asc (GET) | sort reclamation by date in Desc order
-  reclamation/type/GRAVE (GET) | Search for complaints by their complaint_type



