FROM maven:3.8.5-openjdk-17 As build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/fees-0.0.1-SNAPSHOT.jar fees.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","fees.jar"]
