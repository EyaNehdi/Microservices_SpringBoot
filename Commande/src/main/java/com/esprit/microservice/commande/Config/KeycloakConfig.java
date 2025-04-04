package com.esprit.microservice.commande.Config;

import org.jboss.resteasy.client.jaxrs.internal.ResteasyClientBuilderImpl;
import org.keycloak.OAuth2Constants;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {
    @Bean
    public KeycloakSpringBootConfigResolver
    keycloakSpringBootConfigResolver() {
        return new KeycloakSpringBootConfigResolver();
    }
        static Keycloak keycloak=null;
        final static String serverUrl = "http://localhost:8066";
        public final static String realm = "JobBoardKeycloack";
        public final static String clientId = "commande";
        final static String clientSecret =
                "65KW8qXwmZ3GyaUt1XglktuLOqlTAKlx";
        final static String userName = "touta";
        final static String password = "touta";
public KeycloakConfig() {
        }
        @Bean
        public static Keycloak getInstance() {
            if (keycloak == null) {
                keycloak = KeycloakBuilder.builder()
                        .serverUrl(serverUrl)
                        .realm(realm)
                        .grantType(OAuth2Constants.PASSWORD)
                        .username(userName)
                        .password(password)
                        .clientId(clientId)
                        .clientSecret(clientSecret)
                        .resteasyClient(new ResteasyClientBuilderImpl()
                                .connectionPoolSize(10)
                                .build())
                        .build();
            }
            return keycloak;
        }
    }