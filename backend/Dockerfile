# Use Java 21
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy only the built JAR
COPY target/ride-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java","-jar","app.jar"]
