FROM openjdk:17
EXPOSE 8082
ADD target/Delivery-ms-0.0.1-SNAPSHOT.jar delivery-ms.jar
ENTRYPOINT ["java", "-jar", "delivery-ms.jar"]