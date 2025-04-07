FROM openjdk:22
EXPOSE 8082
ADD target/eureka-0.0.1-SNAPSHOT.jar eureka.jar
ENTRYPOINT ["java", "-jar", "eureka.jar"]