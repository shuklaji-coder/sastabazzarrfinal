# Backend Dockerfile for root-level deployment (Monorepo)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the backend pom.xml and download dependencies
COPY backend/pom.xml backend/
RUN cd backend && mvn dependency:go-offline -B

# Copy the source code and build
COPY backend/src backend/src
RUN cd backend && mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar file
COPY --from=build /app/backend/target/*.jar app.jar

# Expose backend port
EXPOSE 5454

ENTRYPOINT ["java", "-jar", "app.jar"]
