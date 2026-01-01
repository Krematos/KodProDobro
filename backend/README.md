# Backend - KodProDobro (ImpactLink CZ)

Tato složka obsahuje backendovou část aplikace postavenou na frameworku **Spring Boot**.

## 🛠️ Technologie

*   **Java 21**
*   **Spring Boot 3.x**
*   **Maven** (Sestavení a správa závislostí)
*   **PostgreSQL** (Databáze)
*   **Spring Security** (Autentizace a autorizace)

## 📂 Struktura projektu

Zdrojové kódy se nacházejí v `src/main/java/com/kodprodobro/kodprodobro`. Hlavní balíčky:

*   `config/` - Konfigurace aplikace (CORS, Swagger/OpenAPI, Security).
*   `controllers/` - REST API endpointy (`AuthController`, `ProjectController`, aj.).
*   `services/` - Byznys logika aplikace.
*   `repositories/` - Data Access Layer (komunikace s databází přes JPA).
*   `models/` - Databázové entity (např. `User`, `Project`, `Chat`).
*   `dto/` - Data Transfer Objects pro přenos dat mezi frontendem a backendem.
*   `security/` - JWT filtry a bezpečnostní konfigurace.
*   `exception/` - Globální ošetření chyb.

## 🚀 Jak začít

### Prerekvizity

Ujistěte se, že máte nainstalované:
1.  **Java 21 JDK**
2.  **Maven**
3.  **PostgreSQL**

### Konfigurace databáze

Před spuštěním upravte soubor `src/main/resources/application.properties`. Nastavte přístupové údaje k vaší lokální databázi:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/kodprodobro_db
spring.datasource.username=vase_uzivatelske_jmeno
spring.datasource.password=vase_heslo
spring.jpa.hibernate.ddl-auto=update
```

*(Poznámka: Název databáze `kodprodobro_db` si můžete zvolit libovolně, ale musí existovat.)*

### Spuštění aplikace

V kořenovém adresáři `backend/` spusťte příkaz:

```bash
mvn spring-boot:run
```

Server se spustí na portu **8080**.
API dokumentace (pokud je nakonfigurován Swagger) bývá dostupná na `http://localhost:8080/swagger-ui.html`.

## 🔌 API Endpointy

Hlavní sekce API:

*   **Auth** (`/api/auth`): Registrace a přihlašování uživatelů.
*   **Projects** (`/api/projects`): Správa projektů.
*   **Users** (`/api/users`): Správa uživatelských profilů.
*   **Chat** (`/api/chat`): Funkcionalita chatu.

## 🧪 Testování

Pro spuštění testů použijte:

```bash
mvn test
```
