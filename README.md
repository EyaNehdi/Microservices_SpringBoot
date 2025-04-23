<h2 align="center">
 Microservice Project
 </h2> 

# Technologies and Architecture

This project follows a Microservices Architecture, where different services are developed and deployed independently. Each service has its own responsibility, communicates with other services via APIs, and can be scaled individually.

## Key Benefits of Microservices:

### 1️⃣ Eureka Server (Service Discovery)

**Purpose:** Acts as a registry where all microservices register themselves. It helps with service discovery and load balancing.  
When a service wants to communicate with another service, it queries Eureka for the available instances.  
**Key Dependencies:** `spring-cloud-starter-netflix-eureka-server`

---

### 2️⃣ API Gateway (Spring Cloud Gateway)

**Purpose:** Serves as the entry point for all client requests.  
**Routing:** Directs requests to the appropriate microservices.  
**Security:** Handles authentication and authorization (integrates with Keycloak for security).  

- Clients send requests to the gateway.  
- The gateway forwards requests to the appropriate microservices using Eureka service discovery.

**Key Dependencies:** `spring-cloud-starter-gateway`, `spring-cloud-starter-netflix-eureka-client`

---

### 3️⃣ Microservices (Order, Product, Event, Review,Delivery)

- Expose different REST APIs for each microservice.
- Use different databases for persistence (MongoDB, PostgreSQL, MySQL, H2).
- Register with Eureka for service discovery.
- Communicate via the API Gateway for client access.

**Key Dependencies:**  
`spring-boot-starter-web`, `spring-boot-starter-data-*`, `spring-cloud-starter-netflix-eureka-client`

---

### 4️⃣ Config Server (Spring Cloud Config)

**Purpose:** Centralized external configuration management for all microservices.  
- Microservices retrieve their configuration from this server during startup.
- Supports versioned config via Git backend.

**Key Dependencies:** `spring-cloud-config-server`, `spring-cloud-starter-config`

---

### 5️⃣ User Microservice (Node.js)

**Purpose:** Handles user-related operations (e.g., registration, login).  
- Built using **Node.js** and **Express.js**
- Uses **MongoDB** for data persistence.
- Communicates with Keycloak for authentication.
- Registers with Eureka (via a sidecar if needed).

**Key Features:**
- RESTful APIs for user management
- Environment-based config (compatible with Spring Config Server)
- JWT support for token validation

---

### 6️⃣ Keycloak (Identity and Access Management)

**Purpose:** Provides authentication and authorization services.  
- Keycloak issues JWT tokens used across the platform.
- Uses MySQL for storing users, roles, and realms.

**Key Dependencies:** `keycloak-spring-boot-starter`, `spring-security-oauth2`

---

### 7️⃣ Frontend (React)

**Purpose:** Serves as the client interface for users.  
- Built with **React.js**  
- Connects to backend services through the **API Gateway**
- Handles routing, state management (Redux/Context), and UI components

**Key Features:**
- Authentication via Keycloak
- Dynamic dashboards, product views, and event pages
- Responsive design with modern UI libraries


## 🐳 Installation (Using Docker Compose)

To get the entire microservices architecture up and running locally, follow these steps:

### ⚙️ Prerequisites
Make sure you have the following installed:
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)

### 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-microservice-project.git
   cd your-microservice-project


### 🚀 This architecture ensures a secure, scalable, and maintainable microservices-based system!
# Leave a ⭐ if you liked this project !