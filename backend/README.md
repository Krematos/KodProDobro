# Backend - KodProDobro (ImpactLink CZ)

Tato složka obsahuje backendovou část aplikace postavenou na frameworku **Spring Boot**.

## 🛠️ Technologie

*   **Java 25**
*   **Spring Boot 3.5.8**
*   **Maven** (Sestavení a správa závislostí)
*   **PostgreSQL** (Databáze)
*   **Spring Security** (Autentizace a autorizace, OAuth2 Resource Server)
*   **Hibernate / CPA** (ORM)
*   **MapStruct** (Mapování objektů)
*   **Lombok** (Redukce boilerplate kódu)
*   **JJWT 0.13.0** (JSON Web Token)
*   **Bucket4j** (Rate Limiting)
*   **Caffeine** (Caching)
*   **Spring Actuator & Micrometer** (Prometheus Monitoring)
*   **SpringDoc OpenAPI** (Swagger Dokumentace)
*   **JavaMailSender & Thymeleaf** (E-maily a šablony)

## 📂 Struktura projektu

Zdrojové kódy se nacházejí v `src/main/java/com/kodprodobro/kodprodobro`. Hlavní balíčky:

*   `config/` - Konfigurace aplikace (CORS, Swagger/OpenAPI, Security).
*   `controllers/` - REST API endpointy (`AuthController`, `ProjectController`, aj.).
*   `services/` - Byznys logika aplikace.
*   `repositories/` - Data Access Layer (komunikace s databází přes JPA).
*   `models/` - Databázové entity (např. `User`, `Project`, `Chat`).
*   `dto/` - Data Transfer Objects pro přenos dat mezi frontendem a backendem.
*   `mapper/` - Mapování mezi DTO a entitami (MapStruct).
*   `security/` - JWT filtry a bezpečnostní konfigurace.
*   `exception/` - Globální ošetření chyb.
*   `event/` - Události a listenery.
*   `component/` - Pomocné komponenty.

## 🚀 Jak začít

### Prerekvizity

Ujistěte se, že máte nainstalované:
1.  **Java 25 JDK**
2.  **Maven**
3.  **PostgreSQL**

### Konfigurace databáze

Před spuštěním upravte soubor `src/main/resources/application.properties`. Nastavte přístupové údaje k vaší lokální databázi:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/kodprodobro
spring.datasource.username=postgres
spring.datasource.password=java-junior-programator27
spring.jpa.hibernate.ddl-auto=update
```

*(Poznámka: Výchozí port databáze je nastaven na **5433**. Název databáze `kodprodobro` si můžete zvolit libovolně, ale musí existovat.)*

### Spuštění aplikace

V kořenovém adresáři `backend/` spusťte příkaz:

```bash
mvn spring-boot:run
```

Server se spustí na portu **8080**.
API dokumentace je dostupná na `http://localhost:8080/swagger-ui.html`.

## 🔌 API Endpointy

Hlavní sekce API:

*   **Auth** (`/api/auth`): Registrace a přihlašování uživatelů.
*   **Projects** (`/api/projects`): Správa projektů.
*   **Users** (`/api/users`): Správa uživatelských profilů.
*   **Chat** (`/api/chat`): Funkcionalita chatu.

Monitoring endpointy (Actuator): `/actuator/prometheus`, `/actuator/health`.

## 🧪 Testování

Pro spuštění testů použijte:

```bash
mvn test
```
