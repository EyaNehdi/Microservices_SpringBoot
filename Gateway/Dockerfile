FROM openjdk:22
EXPOSE 8082
ADD target/Gateway-0.0.1-SNAPSHOT.jar gatway.jar
ENTRYPOINT ["java", "-jar", "gatway.jar"]