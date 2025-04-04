FROM openjdk:17
EXPOSE 8084
ADD target/euroka-0.0.1-SNAPSHOT.jar eurekaserver.jar
ENTRYPOINT ["java", "-jar", "eurekaserver.jar"]