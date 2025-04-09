# Étape de construction
FROM maven:3.9.5-eclipse-temurin-21 AS build
COPY . .
RUN mvn clean package -DskipTests

# Étape de création de l'image finale
FROM openjdk:21-slim
COPY --from=build /target/livresion-0.0.1-SNAPSHOT.jar livresion.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "livresion.jar"]
