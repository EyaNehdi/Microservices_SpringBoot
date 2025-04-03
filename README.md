<h2 align="center">
 Microservice Project
 </h2> 

# Technologies and Architecture

This project follows a Microservices Architecture, where different services are developed and deployed independently. Each service has its own responsibility, communicates with other services via APIs, and can be scaled individually.

## Key Benefits of Microservices:

1️⃣ Eureka Server (Service Discovery)

Purpose: Acts as a registry where all microservices register themselves. It helps with service discovery and load balancing.

Why it's needed? Instead of hardcoding service addresses, microservices can dynamically discover each other.

How it works?

Services register themselves with Eureka.

When a service wants to communicate with another service, it queries Eureka for the available instances.

Key Dependencies: spring-cloud-starter-netflix-eureka-server

2️⃣ API Gateway (Spring Cloud Gateway)

Purpose: Serves as the entry point for all client requests.

Responsibilities:

Routing: Directs requests to the appropriate microservices.

Load Balancing: Distributes requests across multiple instances of a service.

Security: Handles authentication and authorization (integrates with Keycloak for security).

How it works?

Clients send requests to the gateway.

The gateway forwards requests to the appropriate microservices using Eureka service discovery.

Key Dependencies: spring-cloud-starter-gateway, spring-cloud-starter-netflix-eureka-client

3️⃣ Commande Service

Purpose: Manages orders and transactions related to products/services.

Responsibilities:

Handling order creation, retrieval, and updates.

Storing order data in MongoDB.

How it works?

Exposes REST APIs for order management.

Uses MongoDB for data persistence.

Registers with Eureka for service discovery.

Communicates with Gateway for client access.

Key Dependencies: spring-boot-starter-web, spring-boot-starter-data-mongodb, spring-cloud-starter-netflix-eureka-client

4️⃣ Keycloak (Identity and Access Management)

Purpose: Provides authentication and authorization services.

Why it's needed?

Instead of handling authentication inside each microservice, we centralize it in Keycloak.

How it works?

Users authenticate via Keycloak.

Keycloak issues JWT tokens.

API Gateway and microservices validate tokens to control access.

Database: Uses MySQL for storing users, roles, and realms.

Key Dependencies: keycloak-spring-boot-starter, spring-security-oauth2

How These Services Work Together

The client makes a request to the Gateway.

The Gateway checks authentication via Keycloak.

If the user is authenticated, the Gateway forwards the request to the appropriate microservice (e.g., Commande Service).

The Commande Service fetches data from MongoDB and responds back through the Gateway.

The Gateway sends the response to the client.

Deployment and Persistence

Eureka, Gateway, and Commande Service run inside Docker containers.

MongoDB stores order-related data.

MySQL is used by Keycloak for authentication data.

Volumes are used to persist data across restarts.

This architecture ensures a secure, scalable, and maintainable microservices-based system! 🚀

