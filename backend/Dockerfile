FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Copy source code
COPY src src

# Build the JAR
RUN ./mvnw clean package -DskipTests

# Copy the built JAR to app.jar
RUN cp target/ride-0.0.1-SNAPSHOT.jar app.jar

# Expose the port
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java","-jar","app.jar"]
