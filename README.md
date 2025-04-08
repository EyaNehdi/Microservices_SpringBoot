Ce service gère les événements dans une architecture microservices basée sur Spring Boot, Eureka, Spring Cloud Gateway, et Docker.

 Architecture
Ce microservice fait partie d’un système plus large où :

Eureka Server : Fournit le service discovery.

Spring Cloud Gateway : Route les requêtes client.

Keycloak : Fournit l’authentification et l’autorisation.

MySQL : Base de données relationnelle pour les événements.

 Technologies utilisées
1/Java 17

2/Spring Boot 3.2.x

3/Spring Data JPA

4/MySQL

5/Eureka Client

6/Spring Cloud Gateway

7/Docker

8/IText 7 (Export PDF)

🔌 Endpoints REST disponibles
Méthode	Endpoint	Description
POST	/event/add	Ajouter un nouvel événement
GET	/event/all	Récupérer tous les événements
GET	/event/get/{id}	Récupérer un événement par ID
PUT	/event/update/{id}	Mettre à jour un événement par ID
DELETE	/event/delete/{id}	Supprimer un événement par ID
GET	/event/export/pdf	Exporter la liste des événements en PDF
