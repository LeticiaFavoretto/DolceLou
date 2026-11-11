FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY . .
RUN chmod +x ./mvnw && ./mvnw -B -ntp clean verify

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/dolcelou-0.0.1-SNAPSHOT.jar /app/app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
