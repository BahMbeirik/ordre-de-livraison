# Étape de construction
FROM maven:3.8.2-jdk-11 AS build
COPY . .
RUN mvn clean package -DskipTests

# Étape de création de l'image finale
FROM openjdk:11-jdk-slim
COPY --from=build /target/livresion-0.0.1-SNAPSHOT.jar.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
